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
        [finalImage lockFocusFlipped:YES];

        [[NSColor whiteColor] setFill];
        NSRectFill(NSMakeRect(0,0,1080,1080));

        CGFloat imgW = bgImage.size.width;
        CGFloat imgH = bgImage.size.height;
        CGFloat scale = MAX(1080.0 / imgW, 1080.0 / imgH);
        CGFloat drawW = imgW * scale;
        CGFloat drawH = imgH * scale;
        CGFloat drawX = (1080.0 - drawW) / 2.0;
        CGFloat drawY = (1080.0 - drawH) / 2.0;
        
        drawY += 150; // Push building down so arches are in upper half

        [bgImage drawInRect:NSMakeRect(drawX, drawY, drawW, drawH)
                   fromRect:NSMakeRect(0, 0, imgW, imgH)
                  operation:NSCompositingOperationSourceOver
                   fraction:1.0];

        // White Panel Box
        CGFloat boxX = 40;
        CGFloat boxW = 1000;
        CGFloat boxH = 680;
        CGFloat boxY = 360; // Top is Y=360, Bottom is 1040

        NSColor *whiteBoxColor = [NSColor colorWithCalibratedWhite:1.0 alpha:0.95];
        [whiteBoxColor setFill];
        NSBezierPath *panel = [NSBezierPath bezierPathWithRect:NSMakeRect(boxX, boxY, boxW, boxH)];
        [panel fill];

        [[NSColor colorWithCalibratedWhite:0.1 alpha:1.0] setStroke];
        [panel setLineWidth:2.0];
        [panel stroke];

        NSColor *textColor = [NSColor colorWithCalibratedWhite:0.05 alpha:1.0];
        NSColor *orangeColor = [NSColor colorWithCalibratedRed:0.9 green:0.5 blue:0.0 alpha:1.0];
        NSColor *grayColor = [NSColor colorWithCalibratedWhite:0.35 alpha:1.0];

        NSFont *fontPill = [NSFont fontWithName:@"HelveticaNeue-Medium" size:20];
        NSFont *fontHead = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:68];
        NSFont *fontSub = [NSFont fontWithName:@"HelveticaNeue-Bold" size:24];
        
        NSFont *fontJobTitle = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:34];
        NSFont *fontJobDesc = [NSFont fontWithName:@"HelveticaNeue-Medium" size:18];

        if(!fontHead) fontHead = [NSFont boldSystemFontOfSize:68];
        if(!fontJobTitle) fontJobTitle = [NSFont boldSystemFontOfSize:34];

        CGFloat contentLeft = boxX + 40;
        CGFloat contentW = boxW - 80;

        drawText(@"[    ]   VAGAS ABERTAS   //   LOJA MATRIZ", contentLeft, boxY + 40, fontPill, textColor, NSTextAlignmentLeft, contentW);

        NSMutableParagraphStyle *styleHeadline = [[NSMutableParagraphStyle alloc] init];
        [styleHeadline setAlignment:NSTextAlignmentLeft];
        [styleHeadline setMaximumLineHeight:66];
        [styleHeadline setMinimumLineHeight:66];
        NSDictionary *attrHead = @{
            NSFontAttributeName: fontHead,
            NSForegroundColorAttributeName: textColor,
            NSParagraphStyleAttributeName: styleHeadline
        };
        NSString *headline = @"ESTAMOS\nCONTRATANDO";
        [headline drawInRect:NSMakeRect(contentLeft, boxY + 80, contentW, 140) withAttributes:attrHead];

        drawText(@"SALÁRIO + COMISSÃO", contentLeft, boxY + 220, fontSub, orangeColor, NSTextAlignmentLeft, contentW);

        void (^drawLine)(CGFloat) = ^(CGFloat yLoc) {
            NSBezierPath *line = [NSBezierPath bezierPath];
            [line moveToPoint:NSMakePoint(contentLeft, yLoc)];
            [line lineToPoint:NSMakePoint(contentLeft + contentW, yLoc)];
            [line setLineWidth:1.5];
            [[NSColor colorWithCalibratedWhite:0.8 alpha:1.0] setStroke];
            [line stroke];
        };

        CGFloat listY = boxY + 270;
        drawLine(listY);

        CGFloat v1Y = listY + 20;
        drawText(@"CONSULTORA DE VENDAS", contentLeft, v1Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ATENDIMENTO SHOWROOM E LEADS", contentLeft, v1Y + 40, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v1Y + 75);

        CGFloat v2Y = v1Y + 95;
        drawText(@"TÉCNICO EM MANUTENÇÃO", contentLeft, v2Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ESPECIALISTA EM SCOOTERS", contentLeft, v2Y + 40, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v2Y + 75);

        CGFloat v3Y = v2Y + 95;
        drawText(@"PROFISSIONAL DA LIMPEZA", contentLeft, v3Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ZELO DO SHOWROOM", contentLeft, v3Y + 40, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v3Y + 75);

        CGFloat footerY = boxY + 560;
        NSFont *fontCTABig = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:30];
        if(!fontCTABig) fontCTABig = [NSFont boldSystemFontOfSize:30];

        NSBezierPath *ctaBox = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(contentLeft, footerY, contentW, 80) xRadius:6 yRadius:6];
        [textColor setFill];
        [ctaBox fill];

        drawText(@"ENVIE SEU CURRÍCULO VIA WHATSAPP", contentLeft, footerY + 23, fontCTABig, [NSColor whiteColor], NSTextAlignmentCenter, contentW);

        [finalImage unlockFocus];

        NSData *imageData = [finalImage TIFFRepresentation];
        NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
        NSDictionary *imageProps = @{NSImageCompressionFactor: @0.9};
        NSData *jpegData = [imageRep representationUsingType:NSBitmapImageFileTypeJPEG properties:imageProps];
        [jpegData writeToFile:outPath atomically:YES];
        
        NSLog(@"Hiring Feed fix layout rendered successfully!");
    }
    return 0;
}
