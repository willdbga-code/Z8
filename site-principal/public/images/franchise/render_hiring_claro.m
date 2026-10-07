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
        NSString *inPath = @"/Users/apple/.gemini/antigravity/brain/1e8470d9-4fdd-478d-acdb-5d3e2c5aa6a6/.user_uploaded/media_1790083439526.jpg";
        NSString *outPath = @"/Users/apple/Desktop/Z8/site-principal/public/images/franchise/story_hiring_claro.jpg";

        NSImage *bgImage = [[NSImage alloc] initWithContentsOfFile:inPath];
        if (!bgImage) {
            NSLog(@"Failed to load image");
            return 1;
        }

        NSSize size = NSMakeSize(1080, 1920);
        NSImage *finalImage = [[NSImage alloc] initWithSize:size];
        [finalImage lockFocus];

        // Draw background aspect fill
        CGFloat imgW = bgImage.size.width;
        CGFloat imgH = bgImage.size.height;
        CGFloat scale = MAX(1080.0 / imgW, 1920.0 / imgH);
        CGFloat drawW = imgW * scale;
        CGFloat drawH = imgH * scale;
        CGFloat drawX = (1080.0 - drawW) / 2.0;
        // Shift image up slightly so arches are visible at the top
        CGFloat drawY = (1920.0 - drawH) / 2.0 - 100;

        [bgImage drawInRect:NSMakeRect(drawX, drawY, drawW, drawH)
                   fromRect:NSMakeRect(0, 0, imgW, imgH)
                  operation:NSCompositingOperationCopy
                   fraction:1.0];

        // Draw Dark overlay to make the top photo pop but readable if needed? 
        // No, user wants it "claro". We will draw a solid white box.

        // White Panel Box
        CGFloat boxX = 50;
        CGFloat boxW = 980;
        CGFloat boxH = 1450;
        CGFloat boxY = 80; // Leaves 1920 - 1450 - 80 = 390px of photo at top

        NSColor *whiteBoxColor = [NSColor colorWithCalibratedWhite:1.0 alpha:0.96];
        [whiteBoxColor setFill];
        NSBezierPath *panel = [NSBezierPath bezierPathWithRect:NSMakeRect(boxX, boxY, boxW, boxH)];
        [panel fill];

        // Thin black border around the panel
        [[NSColor colorWithCalibratedWhite:0.1 alpha:1.0] setStroke];
        [panel setLineWidth:2.0];
        [panel stroke];

        // Colors
        NSColor *textColor = [NSColor colorWithCalibratedWhite:0.1 alpha:1.0];
        NSColor *orangeColor = [NSColor colorWithCalibratedRed:0.9 green:0.5 blue:0.0 alpha:1.0];
        NSColor *grayColor = [NSColor colorWithCalibratedWhite:0.4 alpha:1.0];

        // Typography setup
        NSFont *fontPill = [NSFont fontWithName:@"HelveticaNeue-Medium" size:22];
        NSFont *fontHead = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:90];
        NSFont *fontSub = [NSFont fontWithName:@"HelveticaNeue-Bold" size:32];
        
        NSFont *fontJobTitle = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:48];
        NSFont *fontJobDesc = [NSFont fontWithName:@"HelveticaNeue-Medium" size:24];

        if(!fontHead) fontHead = [NSFont boldSystemFontOfSize:90];
        if(!fontJobTitle) fontJobTitle = [NSFont boldSystemFontOfSize:48];

        // Layout Y positions (Y-up)
        // Box Top is 1530.
        CGFloat contentLeft = boxX + 50;
        CGFloat contentW = boxW - 100;

        // Pill
        drawText(@"[    ]   VAGAS ABERTAS   //   LOJA MATRIZ Z8", contentLeft, 1450, fontPill, textColor, NSTextAlignmentLeft, contentW);

        // Headline
        NSMutableParagraphStyle *styleHeadline = [[NSMutableParagraphStyle alloc] init];
        [styleHeadline setAlignment:NSTextAlignmentLeft];
        [styleHeadline setMaximumLineHeight:90];
        [styleHeadline setMinimumLineHeight:90];
        NSDictionary *attrHead = @{
            NSFontAttributeName: fontHead,
            NSForegroundColorAttributeName: textColor,
            NSParagraphStyleAttributeName: styleHeadline
        };
        NSString *headline = @"ESTAMOS\nCONTRATANDO";
        [headline drawInRect:NSMakeRect(contentLeft, 1150, contentW, 250) withAttributes:attrHead];

        // Sub
        drawText(@"SALÁRIO + COMISSÃO", contentLeft, 1100, fontSub, orangeColor, NSTextAlignmentLeft, contentW);

        // Line separator helper
        void (^drawLine)(CGFloat) = ^(CGFloat yLoc) {
            NSBezierPath *line = [NSBezierPath bezierPath];
            [line moveToPoint:NSMakePoint(contentLeft, yLoc)];
            [line lineToPoint:NSMakePoint(contentLeft + contentW, yLoc)];
            [line setLineWidth:1.5];
            [[NSColor colorWithCalibratedWhite:0.8 alpha:1.0] setStroke];
            [line stroke];
        };

        CGFloat yStartList = 1000;
        CGFloat itemSpacing = 160;

        drawLine(yStartList);

        // VAGA 1
        CGFloat v1Y = yStartList - 90;
        drawText(@"CONSULTORA DE VENDAS", contentLeft, v1Y + 35, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ATENDIMENTO SHOWROOM & LEADS DIGITAIS", contentLeft, v1Y + 5, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v1Y - 30);

        // VAGA 2
        CGFloat v2Y = v1Y - itemSpacing;
        drawText(@"TÉCNICO EM MANUTENÇÃO", contentLeft, v2Y + 35, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ESPECIALISTA EM SCOOTERS ELÉTRICAS", contentLeft, v2Y + 5, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v2Y - 30);

        // VAGA 3
        CGFloat v3Y = v2Y - itemSpacing;
        drawText(@"PROFISSIONAL DA LIMPEZA", contentLeft, v3Y + 35, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ZELO E MANUTENÇÃO DO SHOWROOM", contentLeft, v3Y + 5, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v3Y - 30);

        // Footer CTA
        CGFloat footerY = 200;
        NSFont *fontCTABig = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:42];
        if(!fontCTABig) fontCTABig = [NSFont boldSystemFontOfSize:42];
        NSFont *fontCTASmall = [NSFont fontWithName:@"HelveticaNeue-Bold" size:22];

        // Draw a dark pill for CTA
        NSBezierPath *ctaBox = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(contentLeft, footerY, contentW, 140) xRadius:10 yRadius:10];
        [textColor setFill];
        [ctaBox fill];

        drawText(@"ENVIE SEU CURRÍCULO", contentLeft, footerY + 70, fontCTABig, [NSColor whiteColor], NSTextAlignmentCenter, contentW);
        drawText(@"CHAME NO WHATSAPP OU DIRECT", contentLeft, footerY + 35, fontCTASmall, orangeColor, NSTextAlignmentCenter, contentW);

        [finalImage unlockFocus];

        // Save as JPEG
        NSData *imageData = [finalImage TIFFRepresentation];
        NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
        NSDictionary *imageProps = @{NSImageCompressionFactor: @0.9};
        NSData *jpegData = [imageRep representationUsingType:NSBitmapImageFileTypeJPEG properties:imageProps];
        [jpegData writeToFile:outPath atomically:YES];
        
        NSLog(@"Hiring Story layout rendered successfully!");
    }
    return 0;
}
