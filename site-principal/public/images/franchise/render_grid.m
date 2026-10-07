#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>

void drawText(NSString *text, CGFloat x, CGFloat y, NSFont *font, NSColor *color, NSTextAlignment alignment, CGFloat width) {
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    [style setAlignment:alignment];
    NSDictionary *attr = @{
        NSFontAttributeName: font,
        NSForegroundColorAttributeName: color,
        NSParagraphStyleAttributeName: style
    };
    NSRect rect = NSMakeRect(x, y, width, 1000);
    [text drawInRect:rect withAttributes:attr];
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *inPath = @"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/base_scooter_grid_1789997090756.jpg";
        NSString *outPath = @"/Users/apple/Desktop/Z8/site-principal/public/images/franchise/story_valedoparaiba_grid.jpg";

        NSImage *bgImage = [[NSImage alloc] initWithContentsOfFile:inPath];
        if (!bgImage) {
            NSLog(@"Failed to load image");
            return 1;
        }

        NSSize size = NSMakeSize(1080, 1920);
        NSImage *finalImage = [[NSImage alloc] initWithSize:size];

        [finalImage lockFocus];

        // Draw background
        [bgImage drawInRect:NSMakeRect(0, 0, 1080, 1920)
                   fromRect:NSMakeRect(0, 0, bgImage.size.width, bgImage.size.height)
                  operation:NSCompositingOperationCopy
                   fraction:1.0];

        // CoreGraphics context
        CGContextRef ctx = (CGContextRef)[[NSGraphicsContext currentContext] graphicsPort];

        // Remember macOS coordinate system is Y-up by default, but we can flip it
        // Let's use flipped coordinates for easier layout (Y=0 at top)
        CGContextTranslateCTM(ctx, 0, 1920);
        CGContextScaleCTM(ctx, 1.0, -1.0);

        // We must draw text using Cocoa in flipped view, which is tricky.
        // Instead of flipping context for Cocoa, let's keep it Y-up but calculate Y positions from top.
        // actual_Y = 1920 - text_height - layout_Y
        CGContextTranslateCTM(ctx, 0, 1920);
        CGContextScaleCTM(ctx, 1.0, -1.0); // flip back, wait.
        
        // Let's just use standard Y-up math.
        // Top = 1920.
        // Y=80 from top -> Y = 1920 - 80 = 1840.

        // Grid Colors
        NSColor *lineColor = [NSColor colorWithCalibratedWhite:0.1 alpha:1.0];
        NSColor *textColor = [NSColor colorWithCalibratedWhite:0.1 alpha:1.0];
        NSColor *whiteColor = [NSColor whiteColor];

        CGFloat lineWidth = 2.5;
        [lineColor setStroke];

        // Grid Box boundaries
        CGFloat leftX = 60;
        CGFloat rightX = 1020;
        CGFloat width = rightX - leftX;

        CGFloat y1 = 1920 - 80;   // Top of Row 1
        CGFloat y2 = 1920 - 160;  // Bottom of Row 1
        CGFloat y3 = 1920 - 400;  // Bottom of Row 2
        CGFloat y4 = 1920 - 580;  // Bottom of Row 3
        
        // Draw Grid Lines
        NSBezierPath *grid = [NSBezierPath bezierPath];
        [grid setLineWidth:lineWidth];

        // Horizontal lines
        [grid moveToPoint:NSMakePoint(leftX, y1)];
        [grid lineToPoint:NSMakePoint(rightX, y1)];
        
        [grid moveToPoint:NSMakePoint(leftX, y2)];
        [grid lineToPoint:NSMakePoint(rightX, y2)];
        
        [grid moveToPoint:NSMakePoint(leftX, y3)];
        [grid lineToPoint:NSMakePoint(rightX, y3)];
        
        [grid moveToPoint:NSMakePoint(leftX, y4)];
        [grid lineToPoint:NSMakePoint(rightX, y4)];

        // Vertical boundaries (extend down to Y=1920-640)
        CGFloat extendY = 1920 - 640;
        [grid moveToPoint:NSMakePoint(leftX, y1)];
        [grid lineToPoint:NSMakePoint(leftX, extendY)];

        [grid moveToPoint:NSMakePoint(rightX, y1)];
        [grid lineToPoint:NSMakePoint(rightX, extendY)];

        // Vertical separators in Row 3
        CGFloat colW = width / 3.0;
        [grid moveToPoint:NSMakePoint(leftX + colW, y3)];
        [grid lineToPoint:NSMakePoint(leftX + colW, y4)];

        [grid moveToPoint:NSMakePoint(leftX + 2*colW, y3)];
        [grid lineToPoint:NSMakePoint(leftX + 2*colW, y4)];

        [grid stroke];

        // Typography setup
        NSFont *fontSmall = [NSFont fontWithName:@"HelveticaNeue-Medium" size:22];
        NSFont *fontMedium = [NSFont fontWithName:@"HelveticaNeue-Bold" size:22];
        NSFont *fontBig = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:76];
        NSFont *fontStatNum = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:64];
        NSFont *fontStatSmall = [NSFont fontWithName:@"HelveticaNeue-Bold" size:18];

        // Ensure fonts loaded, otherwise fallback
        if(!fontBig) fontBig = [NSFont boldSystemFontOfSize:76];
        if(!fontStatNum) fontStatNum = [NSFont boldSystemFontOfSize:64];

        // Row 1 Text
        // Center text in Row 1. Y centers approx Y2 + 25
        drawText(@"[    ]   FRANQUIA Z8 E-MOTION   //   MOBILIDADE ELÉTRICA", leftX + 20, y2 + 26, fontSmall, textColor, NSTextAlignmentLeft, width);

        // Row 2 Text (Headline)
        NSMutableParagraphStyle *styleHeadline = [[NSMutableParagraphStyle alloc] init];
        [styleHeadline setAlignment:NSTextAlignmentLeft];
        [styleHeadline setMaximumLineHeight:80];
        [styleHeadline setMinimumLineHeight:80];
        
        NSDictionary *attrHead = @{
            NSFontAttributeName: fontBig,
            NSForegroundColorAttributeName: textColor,
            NSParagraphStyleAttributeName: styleHeadline
        };
        NSString *headline = @"PRÉ-VENDA OFICIAL:\nFRANQUIAS VALE DO PARAÍBA";
        [headline drawInRect:NSMakeRect(leftX + 25, y3 + 45, width - 50, y2 - y3) withAttributes:attrHead];

        // Row 3 Text (Stats)
        CGFloat textY_statTop = y4 + 115;
        CGFloat textY_statNum = y4 + 45;
        CGFloat textY_statBot = y4 + 18;

        // Col 1
        drawText(@"EXCLUSIVIDADE", leftX, textY_statTop, fontStatSmall, textColor, NSTextAlignmentCenter, colW);
        drawText(@"100%", leftX, textY_statNum, fontStatNum, textColor, NSTextAlignmentCenter, colW);
        drawText(@"DE PRAÇA", leftX, textY_statBot, fontStatSmall, textColor, NSTextAlignmentCenter, colW);

        // Col 2
        drawText(@"LUCRO DIRETO DE", leftX + colW, textY_statTop, fontStatSmall, textColor, NSTextAlignmentCenter, colW);
        drawText(@"ATÉ R$ 4 MIL", leftX + colW, textY_statNum, fontStatNum, textColor, NSTextAlignmentCenter, colW);
        drawText(@"POR MOTO", leftX + colW, textY_statBot, fontStatSmall, textColor, NSTextAlignmentCenter, colW);

        // Col 3
        drawText(@"MARGEM ALTA", leftX + 2*colW, textY_statTop, fontStatSmall, textColor, NSTextAlignmentCenter, colW);
        drawText(@"ATÉ 50%", leftX + 2*colW, textY_statNum, fontStatNum, textColor, NSTextAlignmentCenter, colW);
        drawText(@"DE RENTABILIDADE", leftX + 2*colW, textY_statBot, fontStatSmall, textColor, NSTextAlignmentCenter, colW);

        // --- Bottom Footer Area ---
        CGFloat footerY = 1920 - 1750; // Y = 170
        CGFloat footerH = 100;
        
        // Footer Box Border
        NSBezierPath *btn = [NSBezierPath bezierPathWithRect:NSMakeRect(leftX, footerY, width, footerH)];
        [btn setLineWidth:3.0];
        [whiteColor setStroke];
        [btn stroke];

        // Semi-transparent fill for the button
        [[NSColor colorWithCalibratedWhite:0.0 alpha:0.3] setFill];
        [btn fill];

        // Button Text
        NSFont *btnFont = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:36];
        if(!btnFont) btnFont = [NSFont boldSystemFontOfSize:36];
        drawText(@"AGENDAR REUNIÃO   //   RESERVAR VALE DO PARAÍBA", leftX, footerY + 28, btnFont, whiteColor, NSTextAlignmentCenter, width);

        // Very bottom tiny text
        NSFont *tinyFont = [NSFont fontWithName:@"HelveticaNeue-Bold" size:16];
        drawText(@"Z8EMOTION.COM  •  MOBILIDADE ELÉTRICA  •  REDE AUTORIZADA", leftX, footerY - 50, tinyFont, whiteColor, NSTextAlignmentCenter, width);

        [finalImage unlockFocus];

        // Save as JPEG
        NSData *imageData = [finalImage TIFFRepresentation];
        NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
        NSDictionary *imageProps = @{NSImageCompressionFactor: @0.9};
        NSData *jpegData = [imageRep representationUsingType:NSBitmapImageFileTypeJPEG properties:imageProps];
        [jpegData writeToFile:outPath atomically:YES];
        
        NSLog(@"Grid rendered successfully!");
    }
    return 0;
}
