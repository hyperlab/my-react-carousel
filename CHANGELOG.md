# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.1] - 2019-07-10

### Fixed

- Problems with pinch-to-zoom interactions
- Decrease amount of re-renders triggered by useTouch hook

## [1.3.0] - 2019-07-10

### Added

- Use touch prevention instead of applying `overflow: hidden` to prevent vertical scrolling
- Add offset to swiping to make it easier to switch slides

### Fixed

- No longer prevents pinch-to-zoom interactions

## [1.2.0] - 2019-06-25

### Fixed

- Don't change index when drag stops and you haven't moved if total slides is less than slides to show.
- Make sure dots work as expected in non-infinite mode.

## [1.1.0] - 2019-06-12

### Added

- Remove transition when item width is updated to prevent initial sliding transition on mount.

## [1.0.1] - 2019-05-25

### Added

- Prevent vertical scrolling when scrolling in the carousel.

### Fixed

- ES module build was not importing React correctly.

## [1.0.0] - 2019-05-25

- Initial release

[unreleased]: https://github.com/hyperlab/my-react-carousel/compare/v1.3.0...master
[1.3.0]: https://github.com/hyperlab/my-react-carousel/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/hyperlab/my-react-carousel/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/hyperlab/my-react-carousel/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/hyperlab/my-react-carousel/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/hyperlab/my-react-carousel/commits/v1.0.0
