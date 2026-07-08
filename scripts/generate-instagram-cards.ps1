Add-Type -AssemblyName System.Drawing

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root "deliverables\instagram\2026-06"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
Get-ChildItem -Path $outputDir -File -ErrorAction SilentlyContinue | Remove-Item -Force

function New-Color {
  param(
    [int]$A,
    [int]$R,
    [int]$G,
    [int]$B
  )

  return [System.Drawing.Color]::FromArgb($A, $R, $G, $B)
}

function New-SolidBrush {
  param([System.Drawing.Color]$Color)
  return New-Object System.Drawing.SolidBrush($Color)
}

function New-PenObject {
  param(
    [System.Drawing.Color]$Color,
    [float]$Width = 1
  )

  return New-Object System.Drawing.Pen($Color, $Width)
}

function New-RoundedPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRect {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Brush]$Brush,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-RoundedPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  try {
    $Graphics.FillPath($Brush, $path)
  }
  finally {
    $path.Dispose()
  }
}

function Draw-RoundedBorder {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-RoundedPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  try {
    $Graphics.DrawPath($Pen, $path)
  }
  finally {
    $path.Dispose()
  }
}

function Draw-ImageCover {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Image]$Image,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height
  )

  $scale = [Math]::Max($Width / $Image.Width, $Height / $Image.Height)
  $drawWidth = $Image.Width * $scale
  $drawHeight = $Image.Height * $scale
  $drawX = $X + (($Width - $drawWidth) / 2)
  $drawY = $Y + (($Height - $drawHeight) / 2)
  $Graphics.DrawImage($Image, $drawX, $drawY, $drawWidth, $drawHeight)
}

function Draw-TextBlock {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [System.Drawing.Brush]$Brush,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [string]$Align = "Near"
  )

  $rect = New-Object System.Drawing.RectangleF($X, $Y, $Width, $Height)
  $format = New-Object System.Drawing.StringFormat
  $format.Trimming = [System.Drawing.StringTrimming]::Word
  $format.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  switch ($Align) {
    "Center" { $format.Alignment = [System.Drawing.StringAlignment]::Center }
    "Far" { $format.Alignment = [System.Drawing.StringAlignment]::Far }
    default { $format.Alignment = [System.Drawing.StringAlignment]::Near }
  }
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $Graphics.DrawString($Text, $Font, $Brush, $rect, $format)
  $format.Dispose()
}

function Draw-Pill {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [float]$X,
    [float]$Y,
    [System.Drawing.Color]$FillColor,
    [System.Drawing.Color]$TextColor,
    [float]$PaddingX = 22,
    [float]$PaddingY = 12
  )

  $measure = $Graphics.MeasureString($Text, $Font)
  $width = $measure.Width + ($PaddingX * 2)
  $height = $measure.Height + ($PaddingY * 2)
  $fillBrush = New-SolidBrush $FillColor
  $textBrush = New-SolidBrush $TextColor
  try {
    Fill-RoundedRect -Graphics $Graphics -Brush $fillBrush -X $X -Y $Y -Width $width -Height $height -Radius ($height / 2)
    Draw-TextBlock -Graphics $Graphics -Text $Text -Font $Font -Brush $textBrush -X $X -Y ($Y + $PaddingY - 2) -Width $width -Height ($measure.Height + 12) -Align "Center"
  }
  finally {
    $fillBrush.Dispose()
    $textBrush.Dispose()
  }
}

function Save-Canvas {
  param(
    [string]$Path,
    [scriptblock]$Painter
  )

  $bitmap = New-Object System.Drawing.Bitmap 1080, 1350
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  try {
    & $Painter $graphics
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

$fonts = @{
  label = New-Object System.Drawing.Font("Georgia", 18, [System.Drawing.FontStyle]::Regular)
  title = New-Object System.Drawing.Font("Malgun Gothic", 48, [System.Drawing.FontStyle]::Bold)
  section = New-Object System.Drawing.Font("Malgun Gothic", 32, [System.Drawing.FontStyle]::Bold)
  body = New-Object System.Drawing.Font("Malgun Gothic", 20, [System.Drawing.FontStyle]::Regular)
  bodySmall = New-Object System.Drawing.Font("Malgun Gothic", 17, [System.Drawing.FontStyle]::Regular)
  bodyBold = New-Object System.Drawing.Font("Malgun Gothic", 19, [System.Drawing.FontStyle]::Bold)
  stat = New-Object System.Drawing.Font("Malgun Gothic", 22, [System.Drawing.FontStyle]::Bold)
  cta = New-Object System.Drawing.Font("Georgia", 19, [System.Drawing.FontStyle]::Bold)
}

$courses = @(
  @{
    slug = "basic"
    title = "왕초보반"
    shortTitle = "BEGINNER CLASS"
    image = Join-Path $root "public\assets\d5-perspective.jpg"
    detailImage = Join-Path $root "public\images\d5-basic-01.jpg"
    accent = New-Color 255 210 197 172
    dark = New-Color 255 33 45 58
    light = New-Color 255 245 239 231
    intro = "렌더링이 처음인 분도 따라올 수 있도록 화면 구성부터 재질, 빛, 보정의 흐름을 차근차근 익히는 입문 수업입니다."
    emotional = "막막했던 렌더링의 시작을`n한 번에 정리하는 왕초보용 클래스."
    points = @(
      "D5 기본 화면과 작업 흐름 이해",
      "카메라 구도, 재질, 빛의 기초 잡기",
      "처음부터 끝까지 한 장 완성해보기"
    )
    audience = @(
      "D5를 처음 켜보는 분",
      "렌더링 순서가 늘 헷갈리는 분",
      "기초를 한 번에 정리하고 싶은 분"
    )
    results = @(
      "D5 기본 사용 흐름 이해",
      "기초 설정이 담긴 결과물 1장 완성",
      "혼자 다시 해볼 수 있는 작업 순서 정리"
    )
    schedule = "2026년 6월 20일 토요일"
  },
  @{
    slug = "advanced"
    title = "완성도반"
    shortTitle = "QUALITY CLASS"
    image = Join-Path $root "public\assets\d5-interior.jpg"
    detailImage = Join-Path $root "public\images\d5-intermediate-01.jpg"
    accent = New-Color 255 193 182 132
    dark = New-Color 255 61 51 40
    light = New-Color 255 243 238 230
    intro = "기본 툴 사용은 가능하지만 결과물의 밀도와 분위기가 아쉬운 분들을 위한 완성도 집중 수업입니다."
    emotional = "좋아 보이는 이미지를 넘어`n완성도를 끌어올리는 디테일 수업."
    points = @(
      "구도와 시선 흐름 정리",
      "재질, 조명, 소품 디테일 업그레이드",
      "보정으로 분위기와 밀도 끌어올리기"
    )
    audience = @(
      "기본 렌더는 가능하지만 결과물이 아쉬운 분",
      "포트폴리오 퀄리티를 높이고 싶은 분",
      "빛과 재질 표현을 더 정교하게 다루고 싶은 분"
    )
    results = @(
      "완성도 높은 결과물 1장 정리",
      "장면의 밀도를 조절하는 기준 이해",
      "보정과 디테일 업그레이드 감각 정리"
    )
    schedule = "2026년 6월 20일 토요일"
  }
)

foreach ($course in $courses) {
  $hero = [System.Drawing.Image]::FromFile($course.image)
  $detail = [System.Drawing.Image]::FromFile($course.detailImage)
  try {
    $coverPath = Join-Path $outputDir "$($course.slug)-01-cover.png"
    Save-Canvas -Path $coverPath -Painter {
      param($g)

      Draw-ImageCover -Graphics $g -Image $hero -X 0 -Y 0 -Width 1080 -Height 1350
      $overlayTop = New-SolidBrush (New-Color 118 16 18 24)
      $overlayBottom = New-SolidBrush (New-Color 145 8 9 14)
      $panelBrush = New-SolidBrush (New-Color 198 255 248 241)
      $linePen = New-PenObject (New-Color 90 255 255 255) 1.4
      $textDark = New-SolidBrush $course.dark
      try {
        $g.FillRectangle($overlayTop, 0, 0, 1080, 760)
        $g.FillRectangle($overlayBottom, 0, 760, 1080, 590)
        Fill-RoundedRect -Graphics $g -Brush $panelBrush -X 72 -Y 94 -Width 540 -Height 428 -Radius 34
        Draw-RoundedBorder -Graphics $g -Pen $linePen -X 72 -Y 94 -Width 540 -Height 428 -Radius 34
        Draw-TextBlock -Graphics $g -Text "GOYO STUDIO  |  2026 JUNE OPEN" -Font $fonts.label -Brush $textDark -X 112 -Y 132 -Width 410 -Height 38
        Draw-TextBlock -Graphics $g -Text $course.title -Font $fonts.title -Brush $textDark -X 108 -Y 188 -Width 430 -Height 124
        Draw-TextBlock -Graphics $g -Text $course.emotional -Font $fonts.bodyBold -Brush $textDark -X 112 -Y 326 -Width 430 -Height 126
        Draw-Pill -Graphics $g -Text $course.schedule -Font $fonts.bodySmall -X 84 -Y 1216 -FillColor (New-Color 210 255 255 255) -TextColor $course.dark
        Draw-Pill -Graphics $g -Text "오전 9-12시 · 오후 1-4시 · 12만원" -Font $fonts.bodySmall -X 322 -Y 1216 -FillColor (New-Color 210 255 255 255) -TextColor $course.dark
      }
      finally {
        $overlayTop.Dispose()
        $overlayBottom.Dispose()
        $panelBrush.Dispose()
        $linePen.Dispose()
        $textDark.Dispose()
      }
    }

    $slide2Path = Join-Path $outputDir "$($course.slug)-02-points.png"
    Save-Canvas -Path $slide2Path -Painter {
      param($g)

      $bg = New-SolidBrush $course.light
      $darkBrush = New-SolidBrush $course.dark
      $cardBrush = New-SolidBrush ([System.Drawing.Color]::White)
      $accentBrush = New-SolidBrush (New-Color 255 ($course.accent.R) ($course.accent.G) ($course.accent.B))
      $mutedPen = New-PenObject (New-Color 55 0 0 0) 1
      try {
        $g.FillRectangle($bg, 0, 0, 1080, 1350)
        Fill-RoundedRect -Graphics $g -Brush $cardBrush -X 76 -Y 104 -Width 928 -Height 1142 -Radius 38
        Draw-RoundedBorder -Graphics $g -Pen $mutedPen -X 76 -Y 104 -Width 928 -Height 1142 -Radius 38
        Fill-RoundedRect -Graphics $g -Brush $accentBrush -X 118 -Y 146 -Width 844 -Height 492 -Radius 28
        $clip = New-RoundedPath -X 118 -Y 146 -Width 844 -Height 492 -Radius 28
        try {
          $g.SetClip($clip)
          Draw-ImageCover -Graphics $g -Image $detail -X 118 -Y 146 -Width 844 -Height 492
          $g.ResetClip()
        }
        finally {
          $clip.Dispose()
        }
        Draw-TextBlock -Graphics $g -Text $course.shortTitle -Font $fonts.label -Brush $darkBrush -X 120 -Y 682 -Width 300 -Height 30
        Draw-TextBlock -Graphics $g -Text "이 수업에서 배우는 핵심" -Font $fonts.section -Brush $darkBrush -X 118 -Y 732 -Width 420 -Height 72
        Draw-TextBlock -Graphics $g -Text $course.intro -Font $fonts.body -Brush $darkBrush -X 118 -Y 794 -Width 820 -Height 110

        $bulletY = 952
        foreach ($point in $course.points) {
          Fill-RoundedRect -Graphics $g -Brush $accentBrush -X 118 -Y $bulletY -Width 34 -Height 34 -Radius 17
          Draw-TextBlock -Graphics $g -Text "•" -Font $fonts.bodyBold -Brush $darkBrush -X 123 -Y ($bulletY - 1) -Width 24 -Height 28 -Align "Center"
          Draw-TextBlock -Graphics $g -Text $point -Font $fonts.bodyBold -Brush $darkBrush -X 170 -Y ($bulletY - 1) -Width 748 -Height 38
          $bulletY += 74
        }
      }
      finally {
        $bg.Dispose()
        $darkBrush.Dispose()
        $cardBrush.Dispose()
        $accentBrush.Dispose()
        $mutedPen.Dispose()
      }
    }

    $slide3Path = Join-Path $outputDir "$($course.slug)-03-audience.png"
    Save-Canvas -Path $slide3Path -Painter {
      param($g)

      $bg = New-SolidBrush ([System.Drawing.Color]::White)
      $darkBrush = New-SolidBrush $course.dark
      $softBrush = New-SolidBrush $course.light
      $accentBrush = New-SolidBrush (New-Color 96 ($course.accent.R) ($course.accent.G) ($course.accent.B))
      $borderPen = New-PenObject (New-Color 35 0 0 0) 1.2
      try {
        $g.FillRectangle($bg, 0, 0, 1080, 1350)
        Fill-RoundedRect -Graphics $g -Brush $softBrush -X 76 -Y 84 -Width 928 -Height 1182 -Radius 44
        Draw-RoundedBorder -Graphics $g -Pen $borderPen -X 76 -Y 84 -Width 928 -Height 1182 -Radius 44

        Fill-RoundedRect -Graphics $g -Brush $accentBrush -X 626 -Y 142 -Width 314 -Height 314 -Radius 24
        $clip = New-RoundedPath -X 626 -Y 142 -Width 314 -Height 314 -Radius 24
        try {
          $g.SetClip($clip)
          Draw-ImageCover -Graphics $g -Image $hero -X 626 -Y 142 -Width 314 -Height 314
          $g.ResetClip()
        }
        finally {
          $clip.Dispose()
        }

        Draw-TextBlock -Graphics $g -Text "FOR WHO" -Font $fonts.label -Brush $darkBrush -X 124 -Y 146 -Width 180 -Height 30
        Draw-TextBlock -Graphics $g -Text "이런 분께 추천해요" -Font $fonts.section -Brush $darkBrush -X 118 -Y 204 -Width 420 -Height 72

        $chipY = 320
        foreach ($audience in $course.audience) {
          Fill-RoundedRect -Graphics $g -Brush $accentBrush -X 118 -Y $chipY -Width 432 -Height 92 -Radius 24
          Draw-TextBlock -Graphics $g -Text $audience -Font $fonts.bodyBold -Brush $darkBrush -X 146 -Y ($chipY + 22) -Width 380 -Height 52
          $chipY += 116
        }

        Draw-TextBlock -Graphics $g -Text "수업이 끝나면 남는 것" -Font $fonts.section -Brush $darkBrush -X 118 -Y 710 -Width 420 -Height 72

        $resultY = 800
        for ($i = 0; $i -lt $course.results.Count; $i++) {
          Draw-TextBlock -Graphics $g -Text ("0" + ($i + 1)) -Font $fonts.stat -Brush $darkBrush -X 124 -Y $resultY -Width 54 -Height 32
          Draw-TextBlock -Graphics $g -Text $course.results[$i] -Font $fonts.bodyBold -Brush $darkBrush -X 190 -Y ($resultY - 2) -Width 680 -Height 38
          $resultY += 94
        }
      }
      finally {
        $bg.Dispose()
        $darkBrush.Dispose()
        $softBrush.Dispose()
        $accentBrush.Dispose()
        $borderPen.Dispose()
      }
    }

    $slide4Path = Join-Path $outputDir "$($course.slug)-04-info.png"
    Save-Canvas -Path $slide4Path -Painter {
      param($g)

      Draw-ImageCover -Graphics $g -Image $hero -X 0 -Y 0 -Width 1080 -Height 1350
      $shade = New-SolidBrush (New-Color 165 20 18 18)
      $panelBrush = New-SolidBrush (New-Color 218 250 245 238)
      $accentBrush = New-SolidBrush $course.accent
      $darkBrush = New-SolidBrush $course.dark
      try {
        $g.FillRectangle($shade, 0, 0, 1080, 1350)
        Fill-RoundedRect -Graphics $g -Brush $panelBrush -X 140 -Y 152 -Width 800 -Height 1040 -Radius 42
        Draw-TextBlock -Graphics $g -Text "JUNE CLASS OPEN" -Font $fonts.label -Brush $darkBrush -X 280 -Y 216 -Width 520 -Height 34 -Align "Center"
        Draw-TextBlock -Graphics $g -Text $course.title -Font $fonts.title -Brush $darkBrush -X 260 -Y 280 -Width 560 -Height 120 -Align "Center"

        $rows = @(
          @{ Label = "일정"; Value = $course.schedule },
          @{ Label = "오전"; Value = "09:00 - 12:00 / 3시간" },
          @{ Label = "오후"; Value = "13:00 - 16:00 / 3시간" },
          @{ Label = "수강료"; Value = "12만원" },
          @{ Label = "장소"; Value = "강남역 ansen 스튜디오" }
        )

        $rowY = 440
        foreach ($row in $rows) {
          Fill-RoundedRect -Graphics $g -Brush $accentBrush -X 216 -Y $rowY -Width 160 -Height 62 -Radius 18
          Draw-TextBlock -Graphics $g -Text $row.Label -Font $fonts.bodyBold -Brush $darkBrush -X 216 -Y ($rowY + 10) -Width 160 -Height 44 -Align "Center"
          Draw-TextBlock -Graphics $g -Text $row.Value -Font $fonts.bodyBold -Brush $darkBrush -X 404 -Y ($rowY + 12) -Width 380 -Height 40
          $rowY += 110
        }

        Draw-TextBlock -Graphics $g -Text "신청은 프로필 링크 또는`ngoyo-studio.vercel.app/apply" -Font $fonts.bodyBold -Brush $darkBrush -X 220 -Y 1030 -Width 640 -Height 90 -Align "Center"
        Draw-Pill -Graphics $g -Text "GOYO STUDIO" -Font $fonts.cta -X 404 -Y 1128 -FillColor $course.dark -TextColor ([System.Drawing.Color]::White)
      }
      finally {
        $shade.Dispose()
        $panelBrush.Dispose()
        $accentBrush.Dispose()
        $darkBrush.Dispose()
      }
    }
  }
  finally {
    $hero.Dispose()
    $detail.Dispose()
  }
}

$copyPath = Join-Path $outputDir "instagram-copy.md"
@"
# 고요스튜디오 2026년 6월 강의 오픈 카드뉴스 문구

## 왕초보반
렌더링이 처음인 분들을 위한 기초 정리 클래스.
화면 구성부터 카메라, 재질, 빛, 기본 보정까지 차근차근 따라오며 렌더링 흐름을 한 번에 익힙니다.

2026년 6월 20일 토요일
오전 9시~12시 · 오후 1시~4시
수강료 12만원 · 강남역 ansen 스튜디오

## 완성도반
기본 렌더링은 가능하지만 결과물의 밀도를 더 높이고 싶은 분들을 위한 수업.
구도, 재질, 조명, 소품 디테일과 보정까지 다듬어 더 좋아 보이는 이미지를 만드는 기준을 정리합니다.

2026년 6월 20일 토요일
오전 9시~12시 · 오후 1시~4시
수강료 12만원 · 강남역 ansen 스튜디오

## 공통 안내
- 2026년 6월 10일 기준 요청해주신 운영안에 맞춰 카드뉴스를 다시 구성했습니다.
- 신청 링크: https://goyo-studio.vercel.app/apply
"@ | Set-Content -Encoding UTF8 $copyPath

foreach ($font in $fonts.Values) {
  $font.Dispose()
}

Write-Output "Instagram cards generated in $outputDir"
