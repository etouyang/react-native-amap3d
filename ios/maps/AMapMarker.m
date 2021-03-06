#import <React/UIView+React.h>
#import "AMapMarker.h"

#pragma ide diagnostic ignored "OCUnusedMethodInspection"

@implementation AMapMarker {
    MAPointAnnotation *_annotation;
    MAPinAnnotationView *_pinView;
    MAPinAnnotationColor _pinColor;
    MACustomCalloutView *_calloutView;
    UIImage *_image;
    AMapInfoWindow *_callout;
    AMapView *_mapView;
    BOOL _active;
}

- (instancetype)init {
    _annotation = [MAPointAnnotation new];
    _annotation.coordinate = CLLocationCoordinate2DMake(39.992520, 116.336170);
    _annotation.lockedToScreen = YES;
    _annotation.lockedScreenPoint = CGPointMake(100, 100);
    self = [super initWithAnnotation:_annotation reuseIdentifier:nil];
    self.canShowCallout = YES;
    [self addGestureRecognizer:[
            [UITapGestureRecognizer alloc] initWithTarget:self action:@selector(_handleTap:)]];
    return self;
}

- (NSString *)title {
    return _annotation.title;
}

- (NSString *)subtitle {
    return _annotation.subtitle;
}

- (CLLocationCoordinate2D)coordinate {
    return _annotation.coordinate;
}

- (void)setTitle:(NSString *)title {
    _annotation.title = title;
}

- (void)setColor:(MAPinAnnotationColor)color {
    _pinColor = color;
    _pinView.pinColor = color;
}

#pragma clang diagnostic ignored "-Woverriding-method-mismatch"
- (void)setImage:(NSString *)name {
    _image = [UIImage imageNamed:name];
    if (_image != nil) {
        _pinView.image = _image;
    }
}

- (void)setDescription:(NSString *)description {
    _annotation.subtitle = description;
}

- (void)setCoordinate:(CLLocationCoordinate2D)coordinate {
    _annotation.coordinate = coordinate;
}

- (void)setActive:(BOOL)active {
    _active = active;
    _pinView.selected = active;
    self.selected = active;
    [self updateActive];
}

- (void)setClickable:(BOOL)enabled {
    self.enabled = enabled;
}

- (void)updateActive {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (_active) {
            [_mapView selectAnnotation:self animated:YES];
        } else {
            [_mapView deselectAnnotation:self animated:YES];
        }
    });
}

- (void)setInfoWindowEnabled:(BOOL)enabled {
    _pinView.canShowCallout = enabled;
    self.canShowCallout = enabled;
}

- (void)setMapView:(AMapView *)mapView {
    _mapView = mapView;
}

- (void)_handleTap:(UITapGestureRecognizer *)recognizer {
    _active = YES;
    [self updateActive];
}

- (BOOL)active {
    return _active;
}

- (MAAnnotationView *)annotationView {
    if (self.reactSubviews.count == 0) {
        if (_pinView == nil) {
            _pinView = [[MAPinAnnotationView alloc] initWithAnnotation:_annotation reuseIdentifier:nil];
            _pinView.canShowCallout = YES;
            _pinView.draggable = self.draggable;
            _pinView.pinColor = _pinColor;
            _pinView.customCalloutView = _calloutView;
            _pinView.centerOffset = self.centerOffset;
            if (_image != nil) {
                _pinView.image = _image;
            }
        }
        return _pinView;
    } else {
        return self;
    }
}

- (void)insertReactSubview:(id <RCTComponent>)subview atIndex:(NSInteger)atIndex {
    if ([subview isKindOfClass:[AMapInfoWindow class]]) {
        _callout = (AMapInfoWindow *) subview;
        _callout.delegate = self;

        UIButton *button = [UIButton new];
        [button addSubview:_callout];

        _calloutView = [[MACustomCalloutView alloc] initWithCustomView:button];
        self.customCalloutView = _calloutView;
    } else {
        [super insertReactSubview:subview atIndex:atIndex];
    }
}

- (void)didUpdateReactSubviews {
    [super didUpdateReactSubviews];
    self.bounds = self.reactSubviews[0].bounds;
}

- (void)updateInfoWindow:(AMapInfoWindow *)overlay {
    self.customCalloutView.bounds = overlay.bounds;
}

@end
