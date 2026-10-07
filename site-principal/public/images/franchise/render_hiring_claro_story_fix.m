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
        NSSize size = NSMakeSize(1080, 1920);
        NSImage *finalImage = [[NSImage alloc] initWithSize:size];
        [finalImage lockFocusFlipped:YES]; // TOP-DOWN COORDINATES! Y=0 IS TOP.

        [[NSColor whiteColor] setFill];
        NSRectFill(NSMakeRect(0,0,1080,1920));

        CGFloat imgW = bgImage.size.width;
        CGFloat imgH = bgImage.size.height;
        CGFloat scale = MAX(1080.0 / imgW, 1920.0 / imgH);
        CGFloat drawW = imgW * scale;
        CGFloat drawH = imgH * scale;
        CGFloat drawX = (1080.0 - drawW) / 2.0;
        CGFloat drawY = (1920.0 - drawH) / 2.0;
        
        // Push image down so building arches are near the top 500px.
        drawY += 200;

        [bgImage drawInRect:NSMakeRect(drawX, drawY, drawW, drawH)
                   fromRect:NSMakeRect(0, 0, imgW, imgH)
                  operation:NSCompositingOperationSourceOver
                   fraction:1.0];

        // White Panel Box
        CGFloat boxX = 50;
        CGFloat boxW = 980;
        CGFloat boxH = 1250;
        CGFloat boxY = 600; // Starts at Y=600 down to 1850

        NSColor *whiteBoxColor = [NSColor colorWithCalibratedWhite:1.0 alpha:0.95];
        [whiteBoxColor setFill];
        NSBezierPath *panel = [NSBezierPath bezierPathWithRect:NSMakeRect(boxX, boxY, boxW, boxH)];
        [panel fill];

        [[NSColor colorWithCalibratedWhite:0.1 alpha:1.0] setStroke];
        [panel setLineWidth:2.0];
        [panel stroke];

        // Colors
        NSColor *textColor = [NSColor colorWithCalibratedWhite:0.05 alpha:1.0];
        NSColor *orangeColor = [NSColor colorWithCalibratedRed:0.9 green:0.5 blue:0.0 alpha:1.0];
        NSColor *grayColor = [NSColor colorWithCalibratedWhite:0.35 alpha:1.0];

        // Typography setup
        NSFont *fontPill = [NSFont fontWithName:@"HelveticaNeue-Medium" size:24];
        NSFont *fontHead = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:100];
        NSFont *fontSub = [NSFont fontWithName:@"HelveticaNeue-Bold" size:36];
        
        NSFont *fontJobTitle = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:46];
        NSFont *fontJobDesc = [NSFont fontWithName:@"HelveticaNeue-Medium" size:22];

        if(!fontHead) fontHead = [NSFont boldSystemFontOfSize:100];
        if(!fontJobTitle) fontJobTitle = [NSFont boldSystemFontOfSize:46];

        CGFloat contentLeft = boxX + 60;
        CGFloat contentW = boxW - 120;

        // Content layout (Y-down)
        drawText(@"[    ]   VAGAS ABERTAS   //   LOJA MATRIZ Z8", contentLeft, boxY + 60, fontPill, textColor, NSTextAlignmentLeft, contentW);

        NSMutableParagraphStyle *styleHeadline = [[NSMutableParagraphStyle alloc] init];
        [styleHeadline setAlignment:NSTextAlignmentLeft];
        [styleHeadline setMaximumLineHeight:95];
        [styleHeadline setMinimumLineHeight:95];
        NSDictionary *attrHead = @{
            NSFontAttributeName: fontHead,
            NSForegroundColorAttributeName: textColor,
            NSParagraphStyleAttributeName: styleHeadline
        };
        NSString *headline = @"ESTAMOS\nCONTRATANDO";
        [headline drawInRect:NSMakeRect(contentLeft, boxY + 120, contentW, 250) withAttributes:attrHead];

        drawText(@"SALÁRIO + COMISSÃO", contentLeft, boxY + 330, fontSub, orangeColor, NSTextAlignmentLeft, contentW);

        // Line separator helper
        void (^drawLine)(CGFloat) = ^(CGFloat yLoc) {
            NSBezierPath *line = [NSBezierPath bezierPath];
            [line moveToPoint:NSMakePoint(contentLeft, yLoc)];
            [line lineToPoint:NSMakePoint(contentLeft + contentW, yLoc)];
            [line setLineWidth:1.5];
            [[NSColor colorWithCalibratedWhite:0.8 alpha:1.0] setStroke];
            [line stroke];
        };

        CGFloat listY = boxY + 420;
        drawLine(listY);

        // VAGA 1
        CGFloat v1Y = listY + 30;
        drawText(@"CONSULTORA DE VENDAS", contentLeft, v1Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ATENDIMENTO SHOWROOM & LEADS DIGITAIS", contentLeft, v1Y + 50, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v1Y + 100);

        // VAGA 2
        CGFloat v2Y = v1Y + 130;
        drawText(@"TÉCNICO EM MANUTENÇÃO", contentLeft, v2Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ESPECIALISTA EM SCOOTERS ELÉTRICAS", contentLeft, v2Y + 50, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v2Y + 100);

        // VAGA 3
        CGFloat v3Y = v2Y + 130;
        drawText(@"PROFISSIONAL DA LIMPEZA", contentLeft, v3Y, fontJobTitle, textColor, NSTextAlignmentLeft, contentW);
        drawText(@"ZELO E MANUTENÇÃO DO SHOWROOM", contentLeft, v3Y + 50, fontJobDesc, grayColor, NSTextAlignmentLeft, contentW);
        drawLine(v3Y + 100);

        // Footer CTA
        CGFloat footerY = boxY + 980;
        NSFont *fontCTABig = [NSFont fontWithName:@"HelveticaNeue-CondensedBold" size:44];
        if(!fontCTABig) fontCTABig = [NSFont boldSystemFontOfSize:44];
        NSFont *fontCTASmall = [NSFont fontWithName:@"HelveticaNeue-Bold" size:22];

        NSBezierPath *ctaBox = [NSBezierPath bezierPathWithRoundedRect:NSMakeRect(contentLeft, footerY, contentW, 140) xRadius:8 yRadius:8];
        [textColor setFill];
        [ctaBox fill];

        // Draw text centered in CTA box.
        // For flipped context, y is the top edge.
        drawText(@"ENVIE SEU CURRÍCULO", contentLeft, footerY + 30, fontCTABig, [NSColor whiteColor], NSTextAlignmentCenter, contentW);
        drawText(@"CHAME NO WHATSAPP OU DIRECT", contentLeft, footerY + 85, fontCTASmall, orangeColor, NSTextAlignmentCenter, contentW);

        [finalImage unlockFocus];

        NSData *imageData = [finalImage TIFFRepresentation];
        NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
        NSDictionary *imageProps = @{NSImageCompressionFactor: @0.9};
        NSData *jpegData = [imageRep representationUsingType:NSBitmapImageFileTypeJPEG properties:imageProps];
        [jpegData writeToFile:outPath atomically:YES];
        
        NSLog(@"Hiring Story fix layout rendered successfully!");
    }
    return 0;
}
