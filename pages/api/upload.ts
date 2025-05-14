import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"

// Impede que o Next.js tente interpretar o corpo da requisição automaticamente
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const uploadDir = path.join(process.cwd(), "public", "sounds")
  fs.mkdirSync(uploadDir, { recursive: true })

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Erro no parse:", err)
      return res.status(500).json({ error: "Erro ao processar o upload." })
    }

    const file = files.file
    if (!file || Array.isArray(file) && file.length === 0) {
      return res.status(400).json({ error: "Arquivo inválido ou ausente" })
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file
    const ext = path.extname(uploadedFile.originalFilename || "").toLowerCase()
    const allowed = [".mp3", ".wav", ".mp4"]
    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: "Tipo de arquivo não permitido" })
    }

    const base = path.basename(uploadedFile.originalFilename || "", ext)
    const finalPath = path.join(uploadDir, `${base}${ext}`)

    try {
      fs.renameSync(uploadedFile.filepath, finalPath)
      console.log("Arquivo salvo em:", finalPath)
    } catch (e) {
      console.error("Erro ao mover o arquivo:", e)
      return res.status(500).json({ error: "Erro ao salvar o arquivo" })
    }

    return res.status(200).json({ filename: `/sounds/${base}${ext}` })
  })
}
