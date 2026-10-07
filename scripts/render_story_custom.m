#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>

int main() {
    @autoreleasepool {
        int width = 1080;
        int height = 1920;
        
        CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
        CGContextRef ctx = CGBitmapContextCreate(NULL, width, height, 8, width * 4, colorSpace, kCGImageAlphaPremultipliedLast);
        
        if (!ctx) {
            NSLog(@"Failed to create CGContext");
            return 1;
        }

        NSGraphicsContext *nsContext = [NSGraphicsContext graphicsContextWithCGContext:ctx flipped:YES];
        [NSGraphicsContext setCurrentContext:nsContext];

        // Background color
        [[NSColor colorWithRed:0.04 green:0.06 blue:0.10 alpha:1.0] setFill];
        NSRectFill(NSMakeRect(0, 0, width, height));

        // Load reference image (1:1)
        NSString *imgPath = @"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/.user_uploaded/media_1789490843626.jpg";
        NSImage *srcImage = [[NSImage alloc] initWithContentsOfFile:imgPath];
        
        if (srcImage) {
            // Draw scaled to fill width and positioned in lower-center area
            CGFloat imgW = width;
            CGFloat imgH = width * (srcImage.size.height / srcImage.size.width);
            CGFloat imgY = height - imgH - 120; // Positioned lower so vehicle and store are prominent
            
            NSRect targetRect = NSMakeRect(0, imgY, imgW, imgH);
            [srcImage drawInRect:targetRect fromRect:NSZeroRect operation:NSCompositingOperationCopy fraction:1.0];
        }

        // Top Cinematic Gradient (Dark backdrop for text)
        NSGradient *topGrad = [[NSGradient alloc] initWithStartingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.98]
                                                           endingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.0]];
        [topGrad drawInRect:NSMakeRect(0, 0, width, 720) angle:90];

        // Bottom Cinematic Gradient
        NSGradient *botGrad = [[NSGradient alloc] initWithStartingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.0]
                                                           endingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.98]];
        [botGrad drawInRect:NSMakeRect(0, height - 380, width, 380) angle:90];

        // Left Vertical Gold Accent Bar
        NSGradient *goldGrad = [[NSGradient alloc] initWithStartingColor:[NSColor colorWithRed:0.98 green:0.85 blue:0.38 alpha:1.0]
                                                             endingColor:[NSColor colorWithRed:0.77 green:0.53 blue:0.13 alpha:1.0]];
        [goldGrad drawInRect:NSMakeRect(0, 0, 24, height) angle:90];

        // Text Shadows
        NSShadow *textShadow = [[NSShadow alloc] init];
        textShadow.shadowColor = [[NSColor blackColor] colorWithAlphaComponent:0.95];
        textShadow.shadowOffset = NSMakeSize(0, -4);
        textShadow.shadowBlurRadius = 16;

        // 1. Headline (Uppercase condensed bold white)
        NSFont *headlineFont = [NSFont fontWithName:@"Impact" size:88] ?: [NSFont boldSystemFontOfSize:88];
        NSDictionary *headlineAttrs = @{
            NSFontAttributeName: headlineFont,
            NSForegroundColorAttributeName: [NSColor whiteColor],
            NSShadowAttributeName: textShadow
        };
        [@"EXPANSÃO VALE DO PARAÍBA." drawAtPoint:NSMakePoint(76, 140) withAttributes:headlineAttrs];

        // 2. Sub-headline (MARGEM +50% in Gold)
        NSFont *subFont = [NSFont fontWithName:@"Impact" size:38] ?: [NSFont boldSystemFontOfSize:38];
        NSDictionary *subAttrs = @{
            NSFontAttributeName: subFont,
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.90 green:0.66 blue:0.24 alpha:1.0],
            NSShadowAttributeName: textShadow
        };
        [@"FRANQUIA Z8 // EXCLUSIVIDADE DE PRAÇA // MARGEM +50%" drawAtPoint:NSMakePoint(76, 250) withAttributes:subAttrs];

        // 3. Cities (Clean bold white)
        NSFont *citiesFont = [NSFont systemFontOfSize:28 weight:NSFontWeightBold];
        NSDictionary *citiesAttrs = @{
            NSFontAttributeName: citiesFont,
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.95 green:0.96 blue:0.98 alpha:1.0],
            NSShadowAttributeName: textShadow
        };
        [@"Buscamos parceiros estratégicos em Taubaté, Jacareí, Pindamonhangaba e Região." drawAtPoint:NSMakePoint(76, 314) withAttributes:citiesAttrs];

        // 4. Tag Matriz (Bottom left above badge)
        NSRect tagRect = NSMakeRect(76, height - 260, 480, 56);
        NSBezierPath *tagPath = [NSBezierPath bezierPathWithRoundedRect:tagRect xRadius:14 yRadius:14];
        [[NSColor colorWithRed:0.05 green:0.08 blue:0.15 alpha:0.92] setFill];
        [tagPath fill];
        [[NSColor colorWithRed:0.90 green:0.66 blue:0.24 alpha:0.8] setStroke];
        tagPath.lineWidth = 2;
        [tagPath stroke];

        NSDictionary *tagAttrs = @{
            NSFontAttributeName: [NSFont systemFontOfSize:20 weight:NSFontWeightBlack],
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.95 green:0.85 blue:0.4 alpha:1.0]
        };
        [@"LOJA MATRIZ OFICIAL • Z8 TANK" drawAtPoint:NSMakePoint(110, height - 248) withAttributes:tagAttrs];

        // 5. CTA Pill Badge (Bottom Gold Pill)
        CGFloat badgeW = width - 152;
        CGFloat badgeH = 84;
        NSRect badgeRect = NSMakeRect(76, height - 170, badgeW, badgeH);
        NSBezierPath *badgePath = [NSBezierPath bezierPathWithRoundedRect:badgeRect xRadius:badgeH/2 yRadius:badgeH/2];
        [[NSColor colorWithRed:0.90 green:0.66 blue:0.24 alpha:1.0] setFill];
        [badgePath fill];

        NSDictionary *ctaAttrs = @{
            NSFontAttributeName: [NSFont fontWithName:@"Impact" size:34] ?: [NSFont boldSystemFontOfSize:34],
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.05 green:0.08 blue:0.15 alpha:1.0]
        };
        NSString *ctaText = @"SEJA UM FRANQUEADO • Z8EMOTION.COM";
        NSSize ctaSize = [ctaText sizeWithAttributes:ctaAttrs];
        NSPoint ctaPt = NSMakePoint(76 + (badgeW - ctaSize.width)/2, height - 170 + (badgeH - ctaSize.height)/2);
        [ctaText drawAtPoint:ctaPt withAttributes:ctaAttrs];

        // Export High-Res JPEG
        CGImageRef finalImage = CGBitmapContextCreateImage(ctx);
        NSBitmapImageRep *rep = [[NSBitmapImageRep alloc] initWithCGImage:finalImage];
        NSData *jpgData = [rep representationUsingType:NSBitmapImageFileTypeJPEG properties:@{NSImageCompressionFactor: @0.96}];
        
        NSString *out1 = @"/Users/apple/Desktop/Z8/site-principal/public/images/franchise/story_z8_matriz_margem50.jpg";
        NSString *out2 = @"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/story_z8_matriz_margem50.jpg";
        
        [jpgData writeToFile:out1 atomically:YES];
        [jpgData writeToFile:out2 atomically:YES];
        
        NSLog(@"Story Image rendered successfully to: %@", out1);
    }
    return 0;
}
