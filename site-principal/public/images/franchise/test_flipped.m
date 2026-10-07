#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSImage *img = [[NSImage alloc] initWithSize:NSMakeSize(1080, 1920)];
        [img lockFocusFlipped:YES];
        
        [[NSColor whiteColor] setFill];
        NSRectFill(NSMakeRect(0, 0, 1080, 1920));
        
        [[NSColor redColor] setFill];
        NSRectFill(NSMakeRect(50, 50, 200, 200)); // Should be top-left
        
        NSString *text = @"TESTING TOP LEFT";
        NSDictionary *attr = @{NSFontAttributeName: [NSFont boldSystemFontOfSize:100], NSForegroundColorAttributeName: [NSColor blackColor]};
        [text drawInRect:NSMakeRect(50, 300, 900, 200) withAttributes:attr];
        
        [img unlockFocus];
        
        NSData *png = [[NSBitmapImageRep imageRepWithData:[img TIFFRepresentation]] representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
        [png writeToFile:@"test_flipped.png" atomically:YES];
    }
    return 0;
}
