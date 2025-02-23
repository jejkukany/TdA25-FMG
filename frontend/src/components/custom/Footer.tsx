import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-auto border-t">
			<div className="container mx-auto px-4 py-[22px]">
				<div className="flex flex-col sm:flex-row justify-between items-center">
					<div className="text-sm text-muted-foreground mb-4 sm:mb-0">
						© {currentYear} Think Different Academy. All rights
						reserved.
					</div>
					<nav className="flex space-x-4">
						<Link
							href="/gdpr"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							GDPR
						</Link>
						<Link
							href="/tos"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							ToS
						</Link>
						<Link
							href="/contact"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Contact
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}