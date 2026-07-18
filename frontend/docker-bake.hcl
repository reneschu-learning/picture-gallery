variable "IMAGE_NAME" {
  default = "picture-gallery"
}

variable "VERSION" {
  default = "latest"
}

group "default" {
  targets = ["multi-arch"]
}

target "multi-arch" {
  context    = "."
  dockerfile = "Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  tags = [
    "${IMAGE_NAME}:${VERSION}",
    "${IMAGE_NAME}:latest",
  ]
}