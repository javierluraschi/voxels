#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
voxels <- function(width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'voxels',
    x,
    width = width,
    height = height,
    package = 'voxels',
    elementId = elementId, 
    sizingPolicy = htmlwidgets::sizingPolicy(padding = "0", browser.fill = TRUE)
  )
}

#' Shiny bindings for voxels
#'
#' Output and render functions for using voxels within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a voxels
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name voxels-shiny
#'
#' @export
voxelsOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'voxels', width, height, package = 'voxels')
}

#' @rdname voxels-shiny
#' @export
renderVoxels <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, voxelsOutput, env, quoted = TRUE)
}
