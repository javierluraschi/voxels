Realtime and Interactive Voxels
================

**Early Stage** voxel rendering engine for R.

## Installation

Install the package as follows:

``` r
install.packages("remotes")
remotes::install_github("javierluraschi/voxels")
```

## Getting Started

You can easily launch a voxel explorer and editor,

``` r
library(voxels)
voxels()
```

![](tools/README/voxels-demo.gif)

pass your own 3D matrix to render voxels from it,

``` r
voxels(array(c(
    0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
), dim=c(19, 5, 2)), offset = c(-10, 0, 0))
```

![](tools/README/voxels-hello.png)

or use many interesting R packages to perform interactive visualizations. For instance, we can add some perlin noise to simulate terrain generation:

``` r
library(magrittr)
set.seed(123245)

ceiling(ambient::noise_perlin(c(20, 6, 20)) * 10) %>%
  voxels::voxels(offset = c(-20, 0, -20))
```

Please note that this package is still under-development!
