"use client"

import { useEffect, useState } from "react"
import { socket } from "@/socket"
import { useSearchParams, useRouter } from "next/navigation"
import Board from "@/components/custom/freeplay/Board"
import { client } from "@/server/auth/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, Shield, Copy, Wifi, WifiOff, Loader2, Users, GamepadIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Freeplay() {
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState("N/A")
  const [waiting, setWaiting] = useState(false)
  const [player, setPlayer] = useState(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [createdRoom, setCreatedRoom] = useState<string | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // Get authentication status
  const { data: sessionData, isPending: isAuthLoading } = client.useSession()
  const isAuthenticated = !!sessionData?.user

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name)
      })
    }

    function onDisconnect() {
      setIsConnected(false)
      setTransport("N/A")
    }

    // Game-specific socket events
    socket.on("waitingForPlayer", (roomData) => {
      setWaiting(true)
      if (roomData && roomData.roomId) {
        setRoomId(roomData.roomId)
      }
    })

    socket.on("roomCreated", (roomData) => {
      if (roomData && roomData.roomId) {
        setCreatedRoom(roomData.roomId)
        // Automatically join the room after creating it
        socket.emit("joinRoom", { roomId: roomData.roomId })
        setRoomId(roomData.roomId)
        setWaiting(true)
        // Ensure isHost is set to true when room is created
        setIsHost(true)
        // Update the URL with the room ID but don't navigate
        window.history.replaceState(null, "", `/freeplay?room=${roomData.roomId}`)

        toast({
          title: "Game Room Created",
          description: "Share the link with a friend to start playing!",
          duration: 3000,
        })
      }
    })

    socket.on("playerJoined", () => {
      // This event is received by the host when a second player joins
      console.log("Player joined the room")
      toast({
        title: "Player Joined",
        description: "Another player has joined your game!",
        duration: 3000,
      })
      // The host will automatically receive the assignPlayer event next
    })

    socket.on("assignPlayer", (symbol) => {
      setPlayer(symbol)
      setWaiting(false)

      toast({
        title: "Game Started",
        description: `You are playing as: ${symbol}`,
        duration: 3000,
      })
    })

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    // Check if there's a room parameter in the URL
    const roomParam = searchParams.get("room")
    if (roomParam && isConnected) {
      // Join the room specified in the URL - allow both authenticated and guest users
      socket.emit("joinRoom", { roomId: roomParam })
      setRoomId(roomParam)
      setWaiting(true)
      // Only set isHost to false if we're joining via URL and haven't created the room
      if (!createdRoom) {
        setIsHost(false)
      }
    }

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("waitingForPlayer")
      socket.off("roomCreated")
      socket.off("assignPlayer")
      socket.off("gameState")
    }
  }, [searchParams, isConnected, createdRoom, toast])

  const handleCreateGame = () => {
    socket.emit("createRoom")
    setWaiting(true)
    // Mark as host since they're creating the room
    setIsHost(true)
  }

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/freeplay?room=${roomId || createdRoom}`
    navigator.clipboard.writeText(inviteLink)

    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)

    toast({
      title: "Link Copied",
      description: "Invite link copied to clipboard!",
      duration: 3000,
    })
  }

  // If authentication is still loading, show a loading state
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading game...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if there's a room parameter in the URL for guest users
  const roomParam = searchParams.get("room")

  // If user is not authenticated and doesn't have a room invite, show login message
  if (!isAuthenticated && !roomParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <p className="text-muted-foreground">
              Trying to create a game to play with your friends? You need to be logged in or sign up.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Link href="/sign-in" className="w-full">
              <Button className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Freeplay Game</h1>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1.5">
            {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Game Content */}
        {!player && !waiting && !roomId && !createdRoom ? (
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Freeplay</CardTitle>
              <CardDescription>Create a new game and invite a friend to play with you</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={handleCreateGame} size="lg" className="gap-2" disabled={!isConnected}>
                <GamepadIcon className="h-5 w-5" />
                Create New Game
              </Button>
            </CardContent>
          </Card>
        ) : waiting ? (
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Waiting for Player</CardTitle>
              <CardDescription>Share the invite link with a friend to start playing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>

              {roomId && isHost && (
                <Alert className="bg-muted/50">
                  <Users className="h-4 w-4" />
                  <AlertTitle>Room Code: {roomId}</AlertTitle>
                  <AlertDescription className="mt-2">
                    <Button onClick={copyInviteLink} variant="outline" className="w-full gap-2">
                      {isCopied ? "Copied!" : "Copy Invite Link"}
                      <Copy className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : player ? (
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-medium">
                      Room: {roomId}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium">
                      Playing as: {player}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/freeplay")}
                    className="text-muted-foreground"
                  >
                    Exit Game
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Board initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))} playerSymbol={player} />
            </div>
          </div>
        ) : null}

        {/* Game Instructions */}
        {!player && (
          <Card className="mt-4 border shadow-sm">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create a Game</TabsTrigger>
                  <TabsTrigger value="join">Join a Game</TabsTrigger>
                </TabsList>
                <TabsContent value="create" className="space-y-4 mt-4">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Click the "Create New Game" button above</li>
                    <li>Share the invite link with a friend</li>
                    <li>Wait for your friend to join</li>
                    <li>The game will start automatically when they join</li>
                  </ol>
                </TabsContent>
                <TabsContent value="join" className="space-y-4 mt-4">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Ask your friend to create a game and share the link</li>
                    <li>Click the link they send you</li>
                    <li>You'll automatically join their game</li>
                    <li>The game will start immediately</li>
                  </ol>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

