import Foundation
import CoreGraphics
import AppKit

func renderBanner(width: Int, height: Int, isStory: Bool, outputFile: String) {
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)
    
    guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: colorSpace, bitmapInfo: bitmapInfo.rawValue) else {
        print("Failed to create context")
        return
    }

    // Flip context coordinates to top-left origin
    context.translateBy(x: 0, y: CGFloat(height))
    context.scaleBy(x: 1.0, y: -1.0)

    // Load source background image (Loja Matriz & Z8 Tank)
    let srcPath = "/Users/apple/Desktop/Z8/site-principal/public/images/franchise/franquia_matriz_z8tank_oficial.jpg"
    guard let srcImage = NSImage(contentsOfFile: srcPath),
          let cgSrc = srcImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("Failed to load source image")
        return
    }

    // Draw background image filling dimensions
    let srcW = CGFloat(cgSrc.width)
    let srcH = CGFloat(cgSrc.height)
    let scale = max(CGFloat(width) / srcW, CGFloat(height) / srcH)
    let drawW = srcW * scale
    let drawH = srcH * scale
    let drawX = (CGFloat(width) - drawW) / 2
    let drawY = (CGFloat(height) - drawH) / 2
    
    context.saveGState()
    context.draw(cgSrc, in: CGRect(x: drawX, y: drawY, width: drawW, height: drawH))
    context.restoreGState()

    // Top cinematic gradient
    let topGradColors = [
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.94).cgColor,
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.78).cgColor,
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.0).cgColor
    ] as CFArray
    let topGrad = CGGradient(colorsSpace: colorSpace, colors: topGradColors, locations: [0.0, 0.45, 1.0])!
    context.drawLinearGradient(topGrad, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 0, y: isStory ? 750 : 580), options: [])

    // Bottom cinematic gradient
    let botGradColors = [
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.0).cgColor,
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.75).cgColor,
        NSColor(red: 0, green: 0, blue: 0, alpha: 0.96).cgColor
    ] as CFArray
    let botGrad = CGGradient(colorsSpace: colorSpace, colors: botGradColors, locations: [0.0, 0.55, 1.0])!
    context.drawLinearGradient(botGrad, start: CGPoint(x: 0, y: CGFloat(height) - (isStory ? 600 : 460)), end: CGPoint(x: 0, y: CGFloat(height)), options: [])

    // Left vertical Gold Accent Bar
    let goldBarColors = [
        NSColor(red: 0.98, green: 0.85, blue: 0.38, alpha: 1.0).cgColor,
        NSColor(red: 0.90, green: 0.66, blue: 0.24, alpha: 1.0).cgColor,
        NSColor(red: 0.77, green: 0.53, blue: 0.13, alpha: 1.0).cgColor
    ] as CFArray
    let goldGrad = CGGradient(colorsSpace: colorSpace, colors: goldBarColors, locations: [0.0, 0.5, 1.0])!
    context.drawLinearGradient(goldGrad, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 0, y: CGFloat(height)), options: [])
    context.fill(CGRect(x: 0, y: 0, width: 24, height: height))

    // Set graphics context for Cocoa text drawing
    let nsContext = NSGraphicsContext(cgContext: context, flipped: true)
    NSGraphicsContext.current = nsContext

    // Text Attributes
    let topY: CGFloat = isStory ? 140 : 80
    let startX: CGFloat = 76

    // 1. Headline: EXPANSÃO VALE DO PARAÍBA.
    let headlineFont = NSFont(name: "Impact", size: isStory ? 84 : 76) ?? NSFont.boldSystemFont(ofSize: isStory ? 84 : 76)
    let headlineAttrs: [NSAttributedString.Key: Any] = [
        .font: headlineFont,
        .foregroundColor: NSColor.white,
        .shadow: {
            let s = NSShadow()
            s.shadowColor = NSColor.black.withAlphaComponent(0.95)
            s.shadowOffset = NSSize(width: 0, height: -4)
            s.shadowBlurRadius = 14
            return s
        }()
    ]
    let headlineStr = NSAttributedString(string: "EXPANSÃO VALE DO PARAÍBA.", attributes: headlineAttrs)
    headlineStr.draw(at: NSPoint(x: startX, y: topY))

    // 2. Sub-headline: FRANQUIA Z8 // EXCLUSIVIDADE DE PRAÇA // MARGEM +50%
    let subheadlineY = topY + (isStory ? 100 : 90)
    let subFont = NSFont(name: "Impact", size: isStory ? 38 : 34) ?? NSFont.boldSystemFont(ofSize: isStory ? 38 : 34)
    let subAttrs: [NSAttributedString.Key: Any] = [
        .font: subFont,
        .foregroundColor: NSColor(red: 0.90, green: 0.66, blue: 0.24, alpha: 1.0),
        .shadow: {
            let s = NSShadow()
            s.shadowColor = NSColor.black.withAlphaComponent(0.9)
            s.shadowOffset = NSSize(width: 0, height: -3)
            s.shadowBlurRadius = 10
            return s
        }()
    ]
    let subStr = NSAttributedString(string: "FRANQUIA Z8 // EXCLUSIVIDADE DE PRAÇA // MARGEM +50%", attributes: subAttrs)
    subStr.draw(at: NSPoint(x: startX, y: subheadlineY))

    // 3. Cities description
    let citiesY = subheadlineY + (isStory ? 54 : 48)
    let citiesFont = NSFont(name: "HelveticaNeue-Bold", size: isStory ? 28 : 25) ?? NSFont.systemFont(ofSize: 25, weight: .bold)
    let citiesAttrs: [NSAttributedString.Key: Any] = [
        .font: citiesFont,
        .foregroundColor: NSColor(red: 0.95, green: 0.96, blue: 0.98, alpha: 1.0),
        .shadow: {
            let s = NSShadow()
            s.shadowColor = NSColor.black.withAlphaComponent(0.9)
            s.shadowOffset = NSSize(width: 0, height: -2)
            s.shadowBlurRadius = 8
            return s
        }()
    ]
    let citiesStr = NSAttributedString(string: "Buscamos parceiros estratégicos em Taubaté, Jacareí, Pindamonhangaba e Região.", attributes: citiesAttrs)
    citiesStr.draw(at: NSPoint(x: startX, y: citiesY))

    // 4. Bottom Elements
    let bottomY: CGFloat = CGFloat(height) - (isStory ? 140 : 100)

    // Tag Matriz (Left)
    if !isStory {
        let tagRect = CGRect(x: startX, y: bottomY - 10, width: 420, height: 60)
        let tagPath = NSBezierPath(roundedRect: tagRect, xRadius: 12, yRadius: 12)
        NSColor(red: 0.05, green: 0.08, blue: 0.15, alpha: 0.90).setFill()
        tagPath.fill()
        NSColor(red: 0.90, green: 0.66, blue: 0.24, alpha: 0.8).setStroke()
        tagPath.lineWidth = 2
        tagPath.stroke()

        let dotRect = CGRect(x: startX + 20, y: bottomY + 14, width: 12, height: 12)
        let dotPath = NSBezierPath(ovalIn: dotRect)
        NSColor(red: 0.90, green: 0.66, blue: 0.24, alpha: 1.0).setFill()
        dotPath.fill()

        let tagFont = NSFont.systemFont(ofSize: 18, weight: .black)
        let tagAttrs: [NSAttributedString.Key: Any] = [
            .font: tagFont,
            .foregroundColor: NSColor.white
        ]
        let tagStr = NSAttributedString(string: "LOJA MATRIZ OFICIAL • Z8 TANK", attributes: tagAttrs)
        tagStr.draw(at: NSPoint(x: startX + 44, y: bottomY + 8))
    }

    // CTA Badge (Right for 3:4, Centered for Story)
    let badgeWidth: CGFloat = isStory ? (CGFloat(width) - 160) : 480
    let badgeHeight: CGFloat = isStory ? 76 : 64
    let badgeX: CGFloat = isStory ? 80 : (CGFloat(width) - badgeWidth - 60)
    let badgeY: CGFloat = isStory ? (CGFloat(height) - 160) : (bottomY - 12)

    let badgeRect = CGRect(x: badgeX, y: badgeY, width: badgeWidth, height: badgeHeight)
    let badgePath = NSBezierPath(roundedRect: badgeRect, xRadius: badgeHeight / 2, yRadius: badgeHeight / 2)
    NSColor(red: 0.90, green: 0.66, blue: 0.24, alpha: 1.0).setFill()
    badgePath.fill()

    let ctaFont = NSFont(name: "Impact", size: isStory ? 34 : 26) ?? NSFont.boldSystemFont(ofSize: 26)
    let ctaAttrs: [NSAttributedString.Key: Any] = [
        .font: ctaFont,
        .foregroundColor: NSColor(red: 0.05, green: 0.08, blue: 0.15, alpha: 1.0)
    ]
    let ctaStr = NSAttributedString(string: "SEJA UM FRANQUEADO • Z8EMOTION.COM", attributes: ctaAttrs)
    let strSize = ctaStr.size()
    let ctaTextX = badgeX + (badgeWidth - strSize.width) / 2
    let ctaTextY = badgeY + (badgeHeight - strSize.height) / 2
    ctaStr.draw(at: NSPoint(x: ctaTextX, y: ctaTextY))

    // Save final image to file
    guard let finalCGImage = context.makeImage() else {
        print("Failed to make final image")
        return
    }
    
    let rep = NSBitmapImageRep(cgImage: finalCGImage)
    guard let jpegData = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.95]) else {
        print("Failed to encode JPEG")
        return
    }
    
    let url = URL(fileURLWithPath: outputFile)
    try? jpegData.write(to: url)
    print("Generated: \(outputFile)")
}

// 1. Generate 3:4 (1080 x 1440)
renderBanner(width: 1080, height: 1440, isStory: false, outputFile: "/Users/apple/Desktop/Z8/site-principal/public/images/franchise/franquia_matriz_z8tank_3x4.jpg")
renderBanner(width: 1080, height: 1440, isStory: false, outputFile: "/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/franquia_matriz_z8tank_3x4.jpg")

// 2. Generate Story (1080 x 1920)
renderBanner(width: 1080, height: 1920, isStory: true, outputFile: "/Users/apple/Desktop/Z8/site-principal/public/images/franchise/franquia_matriz_z8tank_story.jpg")
renderBanner(width: 1080, height: 1920, isStory: true, outputFile: "/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/franquia_matriz_z8tank_story.jpg")
