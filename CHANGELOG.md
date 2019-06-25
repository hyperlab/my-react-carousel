# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/hyperlab/my-react-carousel/compare/v1.1.0...master
[1.1.0]: https://github.com/hyperlab/my-react-carousel/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/hyperlab/my-react-carousel/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/hyperlab/my-react-carousel/commits/v1.0.0
