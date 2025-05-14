// pages/api/sounds.ts
import fs from "fs"
import path from "path"

function handler(req, res) {
  const soundsDir = path.join(process.cwd(), "public", "sounds")
  const allowedExts = [".mp3", ".wav", ".mp4"]

  try {
    const files = fs.readdirSync(soundsDir)
    const soundFiles = files.filter((f) =>
      allowedExts.includes(path.extname(f).toLowerCase())
    )

    const paths = soundFiles.map((f) => `/sounds/${f}`)
    res.status(200).json(paths)
  } catch (error) {
    console.error("Erro ao ler arquivos de som:", error)
    res.status(500).json({ error: "Erro ao listar sons" })
  }
}

export default handler
