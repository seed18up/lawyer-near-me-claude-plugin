# Resize large Shutterstock images to ~2000px wide before Cloudinary upload
Add-Type -AssemblyName System.Drawing

$files = @(
  "shutterstock_2618331059.jpg",
  "shutterstock_2609089455.jpg",
  "shutterstock_2515840795.jpg"
)

$downloads = "$env:USERPROFILE\Downloads"

foreach ($f in $files) {
  $src  = Join-Path $downloads $f
  $dest = Join-Path $downloads ($f -replace '\.jpg$', '_small.jpg')

  $img   = [System.Drawing.Image]::FromFile($src)
  $maxW  = 2400
  $ratio = $maxW / $img.Width
  $newW  = $maxW
  $newH  = [int]($img.Height * $ratio)

  $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
  $g   = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $newW, $newH)

  $encoder  = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $encParms = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $encParms.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)
  $bmp.Save($dest, $encoder, $encParms)

  $origMB = [math]::Round((Get-Item $src).Length / 1MB, 1)
  $newMB  = [math]::Round((Get-Item $dest).Length / 1MB, 1)
  Write-Host "✅ $f → $(Split-Path $dest -Leaf) ($origMB MB → $newMB MB)"

  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

Write-Host "`nDone — รันต่อด้วย: node scripts/shutterstock-upload.js"
