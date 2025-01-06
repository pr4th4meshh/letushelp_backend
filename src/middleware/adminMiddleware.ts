export const isAdmin = async (req: any, res: any, next: any) => {
  const user = req.user

  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: You are not an admin" })
  }

  next()
}
