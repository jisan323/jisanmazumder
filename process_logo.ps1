Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\USER\.gemini\antigravity-ide\brain\33a02d2b-3e15-4d84-8408-029c88e31f3d\.user_uploaded\media_1791269615278.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source Width: $($bmp.Width), Height: $($bmp.Height)"

# Copy original to assets
Copy-Item $srcPath -Destination "D:\website\assets\logo-dark-original.png" -Force

# Create transparent version where black background is transparent
$transBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Find bounding box of non-black content
$minX = $bmp.Width; $maxX = 0
$minY = $bmp.Height; $maxY = 0

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        $brightness = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
        
        if ($brightness -gt 15) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }

            # If it's near black, feather alpha
            if ($brightness -lt 40) {
                $alpha = [int](($brightness / 40.0) * 255)
                $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            } else {
                $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            }
        } else {
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

Write-Host "Content Bounding Box: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"

# Save full transparent
$transBmp.Save("D:\website\assets\logo-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Crop Full Logo (Emblem + Text)
$fullWidth = ($maxX - $minX) + 20
$fullHeight = ($maxY - $minY) + 20
$padX = [Math]::Max(0, $minX - 10)
$padY = [Math]::Max(0, $minY - 10)
$fullRect = New-Object System.Drawing.Rectangle($padX, $padY, [Math]::Min($fullWidth, $bmp.Width - $padX), [Math]::Min($fullHeight, $bmp.Height - $padY))
$fullCropped = $transBmp.Clone($fullRect, $transBmp.PixelFormat)
$fullCropped.Save("D:\website\assets\logo-full.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Crop JM Emblem Icon only (top part up to before the "JISAN MAZUMDER" text)
# Emblem spans approximately from minY to about 65% of the total height
$emblemHeight = [int](($maxY - $minY) * 0.62)
$emblemRect = New-Object System.Drawing.Rectangle($padX, $padY, [Math]::Min($fullWidth, $bmp.Width - $padX), $emblemHeight)
$emblemCropped = $transBmp.Clone($emblemRect, $transBmp.PixelFormat)
$emblemCropped.Save("D:\website\assets\logo-emblem.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$transBmp.Dispose()
$fullCropped.Dispose()
$emblemCropped.Dispose()

Write-Host "Logo generation completed successfully!"
