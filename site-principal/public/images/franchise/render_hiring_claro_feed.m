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
        NSString *outPath = @"/Users/apple/Desktop/Z8/site-principal/public/images/franchise/feed_hiring_claro.jpg";

        NSImage *bgImage = [[NSImage alloc] initWithContentsOfFile:inPath];
        NSSize size = NSMakeSize(1080, 1080);
        NSImage *finalImage = [[NSImage alloc] initWithSize:size];
        [finalImage lockFocus];

        // Draw background aspect fill
        CGFloat imgW = bgImage.size.width;
        CGFloat imgH = bgImage.size.height;
        CGFloat scale = MAX(1080.0 / imgW, 1080.0 / imgH);
        CGFloat drawW = imgW * scale;
        CGFloat drawH = imgH * scale;
        CGFloat drawX = (1080.0 - drawW) / 2.0;
        CGFloat drawY = (1080.0 - drawH) / 2.0;

        [bgImage drawInRect:NSMakeRect(drawX, drawY, drawW, drawH)
                   fromRect:NSMakeRect(0, 0, imgW, imgH)
                  operation:NSCompositingOperationCopy
                   fraction:1.0];

        // White Panel Box for Feed (leaves top 380px for photo)
        CGFloat boxX = 40;
        CGFloat boxW = 1000;
        CGFloat boxH = 660; // 1080 - 380 - 40 = 660
        CGFloat boxY = 40;  // 40px from bottom

        NSColor *whiteBoxColor = [NSColor colorWithCalibratedWhite:1.0 alpha:0.96];
        [whiteBoxColor setFill];
        NSBezierPath *panel = [NSBezierPath bezierPathWithRect:NSMakeRect(boxX, boxY, boxW, boxH)];
        [panel fill];
        [[NSColor colorWithCalibratedWhite:0.1 alpha:1.0] setStroke];
        [panel setLineWidth:2.0];
        [panel stroke];

        // Colors
        NSColor *textColor = [NSColor colorWithCalibratedWhite:0.1 alpha:1.0];
        NSColor *orangeColor = [NSColor colorWithCalibratedRed:0.9 green:0.5 blue:0.0 alpha:1.0];
        NSColor *grayColor = [NSColor colorWithCalibratedWhite:0.4 alpha:1.0];

        // Typography setup
        NSFont *fontPill = [NSFont fontWithName:@"HelveticaNeue-Medium" size:18];
        NSFont *fontHead = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:64];
        NSFont *fontSub = [NSFont fontWithName:@"HelveticaNeue-Bold" size:22];
        
        NSFont *fontJobTitle = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:32];
        NSFont *fontJobDesc = [NSFont fontWithName:@"HelveticaNeue-Medium" size:18];

        if(!fontHead) fontHead = [NSFont boldSystemFontOfSize:64];
        if(!fontJobTitle) fontJobTitle = [NSFont boldSystemFontOfSize:32];

        // Layout Y positions
        CGFloat contentLeft = boxX + 40;
        CGFloat contentW = boxW - 80;

        drawText(@"[    ]   VAGAS ABERTAS   //   LOJA MATRIZ", contentLeft, boxY + boxH - 40, fontPill, textColor, NSTextAlignmentLeft, contentW);

        // Headline
        NSMutableParagraphStyle *styleHeadline = [[NSMutableParagraphStyle alloc] init];
        [styleHeadline setAlignment:NSTextAlignmentLeft];
        [styleHeadline setMaximumLineHeight:64];
        [styleHeadline setMinimumLineHeight:64];
        NSDictionary *attrHead = @{
            NSFontAttributeName: fontHead,
            NSForegroundColorAttributeName: textColor,
            NSParagraphStyleAttributeName: styleHeadline
        };
        NSString *headline = @"ESTAMOS\nCONTRATANDO";
        [headline drawInRect:NSMakeRect(contentLeft, boxY + boxH - 210, contentW, 150) withAttributes:attrHead];

        drawText(@"SALÁRIO + COMISSÃO", contentLeft, boxY + boxH - 230, fontSub, orangeColor, NSTextAlignmentLeft, contentW);

        // Line separator helper
        void (^drawLine)(CGFloat) = ^(CGFloat yLoc) {
            NSBezierPath *line = [NSBezierPath bezierPath];
            [line moveToPoint:NSMakePoint(contentLeft, yLoc)];
            [line lineToPoint:NSMakePoint(contentLeft + contentW, yLoc)];
            [line setLineWidth:1.5];
            [[NSColor colorWithCalibratedWhite:0.8 alpha:1.0] setStroke];
            [line stroke];
        };

        CGFloat yStartList = boxY + boxH - 260;
        CGFloat itemSpacing = 85;

        drawLine(yStartList);

        // VAGA 1
        CGFloat v1Y = yStartList - 60;
        drawText(@"CONSULTORA DE VENDAS", contentLeft, v1Y + 25, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ATENDIMENTO SHOWROOM & LEADS", contentLeft, v1Y + 2, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v1Y - 20);

        // VAGA 2
        CGFloat v2Y = v1Y - itemSpacing;
        drawText(@"TÉCNICO EM MANUTENÇÃO", contentLeft, v2Y + 25, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ESPECIALISTA EM SCOOTERS ELÉTRICAS", contentLeft, v2Y + 2, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v2Y - 20);

        // VAGA 3
        CGFloat v3Y = v2Y - itemSpacing;
        drawText(@"PROFISSIONAL DA LIMPEZA", contentLeft, v3Y + 25, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ZELO E MANUTENÇÃO DO SHOWROOM", contentLeft, v3Y + 2, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v3Y - 20);

        // Footer CTA
        CGFloat footerY = boxY + 20;
        NSFont *fontCTABig = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:28];
        if(!fontCTABig) fontCTABig = [NSFont boldSystemFontOfSize:28];

        NSBezierPath *ctaBox = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(contentLeft, footerY, contentW, 80) xRadius:8 yRadius:8];
        [textColor setFill];
        [ctaBox fill];

        drawText(@"ENVIE SEU CURRÍCULO VIA WHATSAPP", contentLeft, footerY + 25, fontCTABig, [NSColor whiteColor], NSTextAlignmentCenter, contentW);

        [finalImage unlockFocus];

        NSData *imageData = [finalImage TIFFRepresentation];
        NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
        NSDictionary *imageProps = @{NSImageCompressionFactor: @0.9};
        NSData *jpegData = [imageRep representationUsingType:NSBitmapImageFileTypeJPEG properties:imageProps];
        [jpegData writeToFile:outPath atomically:YES];
        
        NSLog(@"Hiring Feed layout rendered successfully!");
    }
    return 0;
}
