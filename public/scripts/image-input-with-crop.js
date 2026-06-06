function imageInputWithCrop(
  inputId,
  aspectRatio,
  outputWidth,
  outputHeight,
  viewportWidth,
  viewportHeight,
) {
  return {
    showModal: false,
    previewUrl: null,
    croppieInstance: null,

    onFileSelected(event) {
      const file = event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        this.showModal = true
        this.$nextTick(() => this.initCroppie(e.target.result))
      }
      reader.readAsDataURL(file)
      event.target.value = ""
    },

    initCroppie(src) {
      if (this.croppieInstance) {
        this.croppieInstance.destroy()
      }
      this.croppieInstance = new Croppie(this.$refs.croppieEl, {
        viewport: { width: viewportWidth, height: viewportHeight },
        boundary: { width: viewportWidth, height: viewportHeight + 80 },
        enableExif: true,
        enableZoom: true,
      })
      this.croppieInstance.bind({ url: src })
    },

    async confirmCrop() {
      if (!this.croppieInstance) return
      const blob = await this.croppieInstance.result({
        type: "blob",
        format: "jpeg",
        quality: 0.85,
        size: { width: outputWidth, height: outputHeight },
      })
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })
      const dt = new DataTransfer()
      dt.items.add(file)
      document.getElementById(inputId).files = dt.files
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = URL.createObjectURL(blob)
      this.showModal = false
      this.croppieInstance.destroy()
      this.croppieInstance = null
    },

    cancelCrop() {
      this.showModal = false
      if (this.croppieInstance) {
        this.croppieInstance.destroy()
        this.croppieInstance = null
      }
    },
  }
}
