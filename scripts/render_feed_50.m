#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>

int main() {
    @autoreleasepool {
        int width = 1080;
        int height = 1080;
        
        CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
        CGContextRef ctx = CGBitmapContextCreate(NULL, width, height, 8, width * 4, colorSpace, kCGImageAlphaPremultipliedLast);
        if (!ctx) return 1;

        NSGraphicsContext *nsContext = [NSGraphicsContext graphicsContextWithCGContext:ctx flipped:YES];
        [NSGraphicsContext setCurrentContext:nsContext];

        // Draw background source
        NSString *imgPath = @"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/.user_uploaded/media_1789490843626.jpg";
        NSImage *srcImage = [[NSImage alloc] initWithContentsOfFile:imgPath];
        if (srcImage) {
            [srcImage drawInRect:NSMakeRect(0, 0, width, height) fromRect:NSZeroRect operation:NSCompositingOperationCopy fraction:1.0];
        }

        // Top Overlay Gradient to clearly place updated text
        NSGradient *topGrad = [[NSGradient alloc] initWithStartingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.96]
                                                           endingColor:[NSColor colorWithRed:0.02 green:0.04 blue:0.08 alpha:0.0]];
        [topGrad drawInRect:NSMakeRect(0, 0, width, 400) angle:90];

        // Gold Bar Left
        NSGradient *goldGrad = [[NSGradient alloc] initWithStartingColor:[NSColor colorWithRed:0.98 green:0.85 blue:0.38 alpha:1.0]
                                                             endingColor:[NSColor colorWithRed:0.77 green:0.53 blue:0.13 alpha:1.0]];
        [goldGrad drawInRect:NSMakeRect(0, 0, 24, height) angle:90];

        NSShadow *textShadow = [[NSShadow alloc] init];
        textShadow.shadowColor = [[NSColor blackColor] colorWithAlphaComponent:0.95];
        textShadow.shadowOffset = NSMakeSize(0, -4);
        textShadow.shadowBlurRadius = 14;

        // Headline
        NSFont *headlineFont = [NSFont fontWithName:@"Impact" size:80] ?: [NSFont boldSystemFontOfSize:80];
        NSDictionary *headlineAttrs = @{
            NSFontAttributeName: headlineFont,
            NSForegroundColorAttributeName: [NSColor whiteColor],
            NSShadowAttributeName: textShadow
        };
        [@"EXPANSÃO VALE DO PARAÍBA." drawAtPoint:NSMakePoint(76, 75) withAttributes:headlineAttrs];

        // Sub-headline with Margem +50%
        NSFont *subFont = [NSFont fontWithName:@"Impact" size:36] ?: [NSFont boldSystemFontOfSize:36];
        NSDictionary *subAttrs = @{
            NSFontAttributeName: subFont,
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.90 green:0.66 blue:0.24 alpha:1.0],
            NSShadowAttributeName: textShadow
        };
        [@"FRANQUIA Z8 // EXCLUSIVIDADE DE PRAÇA // MARGEM +50%" drawAtPoint:NSMakePoint(76, 170) withAttributes:subAttrs];

        // Cities
        NSFont *citiesFont = [NSFont systemFontOfSize:26 weight:NSFontWeightBold];
        NSDictionary *citiesAttrs = @{
            NSFontAttributeName: citiesFont,
            NSForegroundColorAttributeName: [NSColor colorWithRed:0.95 green:0.96 blue:0.98 alpha:1.0],
            NSShadowAttributeName: textShadow
        };
        [@"Buscamos parceiros estratégicos em Taubaté, Jacareí, Pindamonhangaba e Região." drawAtPoint:NSMakePoint(76, 225) withAttributes:citiesAttrs];

        // Export 1:1
        CGImageRef finalImage = CGBitmapContextCreateImage(ctx);
        NSBitmapImageRep *rep = [[NSBitmapImageRep alloc] initWithCGImage:finalImage];
        NSData *jpgData = [rep representationUsingType:NSBitmapImageFileTypeJPEG properties:@{NSImageCompressionFactor: @0.96}];
        
        [jpgData writeToFile:@"/Users/apple/Desktop/Z8/site-principal/public/images/franchise/feed_z8_matriz_margem50.jpg" atomically:YES];
        [jpgData writeToFile:@"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/feed_z8_matriz_margem50.jpg" atomically:YES];
    }
    return 0;
}
