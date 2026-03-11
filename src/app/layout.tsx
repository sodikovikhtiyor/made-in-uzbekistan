export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // html and body are provided by [locale]/layout.tsx
  return children;
}
