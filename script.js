class GradientTextStudio {
  constructor() {
    this.currentGradient = "sunset";
    this.currentTheme = "dark";
    this.gradientText = null;
    this.isAnimating = true;

    // Gradient presets
    this.gradients = {
      sunset:
        "linear-gradient(135deg, #5335cf 0%, #de005e 25%, #f66e48 50%, #de005e 75%, #5335cf 100%)",
      ocean: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      galaxy: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)",
      rainbow:
        "linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)",
      neon: "linear-gradient(135deg, #00ff88 0%, #00b4d8 50%, #9d4edd 100%)",
      fire: "linear-gradient(135deg, #ff9a8b 0%, #ad5389 50%, #3c1053 100%)",
    };

    // Color stops for current gradient
    this.colorStops = [
      { color: "#5335cf", position: 0 },
      { color: "#de005e", position: 25 },
      { color: "#f66e48", position: 50 },
      { color: "#de005e", position: 75 },
      { color: "#5335cf", position: 100 },
    ];

    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupParticles();
    this.loadSettings();
    this.updateTextStats();
    this.showWelcomeMessage();
    this.checkBrowserSupport();
  }

  checkBrowserSupport() {
    const testElement = document.createElement("div");
    testElement.style.background = "linear-gradient(red, blue)";
    testElement.style.webkitBackgroundClip = "text";
    testElement.style.webkitTextFillColor = "transparent";

    if (!testElement.style.webkitBackgroundClip) {
      this.showToast(
        "Your browser does not fully support gradient text",
        "info"
      );
      // Apply fallback
      this.gradientText.style.color = "#5335cf";
      this.gradientText.style.background = "none";
      this.gradientText.style.webkitTextFillColor = "initial";
    }
  }

  setupElements() {
    this.gradientText = document.getElementById("gradientText");
    this.toastContainer = document.getElementById("toastContainer");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.exportModal = document.getElementById("exportModal");

    // Control elements
    this.fontFamilySelect = document.getElementById("fontFamily");
    this.fontSizeRange = document.getElementById("fontSize");
    this.fontWeightRange = document.getElementById("fontWeight");
    this.gradientAngleRange = document.getElementById("gradientAngle");
    this.animationSpeedRange = document.getElementById("animationSpeed");
    this.glowIntensityRange = document.getElementById("glowIntensity");

    // Effect toggles
    this.glowEffectToggle = document.getElementById("glowEffect");
    this.reflectionEffectToggle = document.getElementById("reflectionEffect");
    this.shadowEffectToggle = document.getElementById("shadowEffect");

    // Color stops container
    this.colorStopsContainer = document.getElementById("colorStops");
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // Fullscreen toggle
    document.getElementById("fullscreenBtn").addEventListener("click", () => {
      this.toggleFullscreen();
    });

    // Export button
    document.getElementById("exportBtn").addEventListener("click", () => {
      this.showExportModal();
    });

    // Preset buttons
    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectPreset(btn.dataset.preset);
      });
    });

    // Typography controls
    this.fontFamilySelect.addEventListener("change", () => {
      this.updateTypography();
    });

    this.fontSizeRange.addEventListener("input", () => {
      this.updateTypography();
    });

    this.fontWeightRange.addEventListener("input", () => {
      this.updateTypography();
    });

    // Gradient controls
    document.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setGradientType(btn.dataset.type);
      });
    });

    this.gradientAngleRange.addEventListener("input", () => {
      this.updateGradient();
    });

    this.animationSpeedRange.addEventListener("input", () => {
      this.updateAnimation();
    });

    // Effect toggles
    this.glowEffectToggle.addEventListener("change", () => {
      this.toggleGlow();
    });

    this.reflectionEffectToggle.addEventListener("change", () => {
      this.toggleReflection();
    });

    this.shadowEffectToggle.addEventListener("change", () => {
      this.toggleShadow();
    });

    this.glowIntensityRange.addEventListener("input", () => {
      this.updateGlow();
    });

    // Text input
    this.gradientText.addEventListener("input", () => {
      this.updateTextStats();
      this.saveSettings();
    });

    // Color stops
    this.setupColorStopListeners();

    // Add color stop button
    document.getElementById("addColorStop").addEventListener("click", () => {
      this.addColorStop();
    });

    // Export buttons
    document.getElementById("exportPNG").addEventListener("click", () => {
      this.exportAsPNG();
    });

    document.getElementById("exportSVG").addEventListener("click", () => {
      this.exportAsSVG();
    });

    document.getElementById("exportCSS").addEventListener("click", () => {
      this.exportAsCSS();
    });

    document.getElementById("shareLink").addEventListener("click", () => {
      this.shareLink();
    });

    // Modal close
    document.querySelector(".modal-close").addEventListener("click", () => {
      this.hideExportModal();
    });

    // Copy CSS button
    document.getElementById("copyCSS").addEventListener("click", () => {
      this.copyCSS();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Window resize
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  setupColorStopListeners() {
    // Add listeners to existing color stops
    this.colorStopsContainer
      .querySelectorAll(".color-stop")
      .forEach((stop, index) => {
        const colorInput = stop.querySelector('input[type="color"]');
        const rangeInput = stop.querySelector('input[type="range"]');
        const removeBtn = stop.querySelector(".remove-stop");

        colorInput.addEventListener("change", () => {
          this.updateColorStop(index);
        });

        rangeInput.addEventListener("input", () => {
          this.updateColorStopPosition(index);
        });

        removeBtn.addEventListener("click", () => {
          this.removeColorStop(index);
        });
      });
  }

  setupParticles() {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 3 + "s";
      particle.style.animationDuration = Math.random() * 3 + 2 + "s";
      particlesContainer.appendChild(particle);
    }
  }

  selectPreset(presetName) {
    // Remove active class from all presets
    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to selected preset
    document
      .querySelector(`[data-preset="${presetName}"]`)
      .classList.add("active");

    this.currentGradient = presetName;

    // Update gradient based on preset
    const gradient = this.gradients[presetName];
    this.gradientText.style.background = gradient;
    this.gradientText.style.backgroundSize = "400% 400%";
    this.gradientText.style.webkitBackgroundClip = "text";
    this.gradientText.style.webkitTextFillColor = "transparent";
    this.gradientText.style.backgroundClip = "text";
    this.gradientText.style.color = "transparent";

    // Update color stops based on preset
    this.updateColorStopsFromGradient(presetName);

    // Update stats
    document.getElementById("gradientType").textContent =
      this.capitalizeFirst(presetName);

    this.saveSettings();
    this.showToast(
      `Applied ${this.capitalizeFirst(presetName)} preset`,
      "success"
    );
  }

  updateColorStopsFromGradient(presetName) {
    // Define color stops for each preset
    const presetColorStops = {
      sunset: [
        { color: "#5335cf", position: 0 },
        { color: "#de005e", position: 25 },
        { color: "#f66e48", position: 50 },
        { color: "#de005e", position: 75 },
        { color: "#5335cf", position: 100 },
      ],
      ocean: [
        { color: "#667eea", position: 0 },
        { color: "#764ba2", position: 100 },
      ],
      galaxy: [
        { color: "#f093fb", position: 0 },
        { color: "#f5576c", position: 50 },
        { color: "#4facfe", position: 100 },
      ],
      rainbow: [
        { color: "#ff6b6b", position: 0 },
        { color: "#4ecdc4", position: 25 },
        { color: "#45b7d1", position: 50 },
        { color: "#96ceb4", position: 75 },
        { color: "#ffeaa7", position: 100 },
      ],
      neon: [
        { color: "#00ff88", position: 0 },
        { color: "#00b4d8", position: 50 },
        { color: "#9d4edd", position: 100 },
      ],
      fire: [
        { color: "#ff9a8b", position: 0 },
        { color: "#ad5389", position: 50 },
        { color: "#3c1053", position: 100 },
      ],
    };

    this.colorStops = presetColorStops[presetName] || presetColorStops.sunset;
    this.renderColorStops();
  }

  renderColorStops() {
    this.colorStopsContainer.innerHTML = "";

    this.colorStops.forEach((stop, index) => {
      const colorStopElement = document.createElement("div");
      colorStopElement.className = "color-stop";
      colorStopElement.innerHTML = `
                <input type="color" value="${stop.color}">
                <input type="range" min="0" max="100" value="${stop.position}">
                <span>${stop.position}%</span>
                <button class="remove-stop">×</button>
            `;

      this.colorStopsContainer.appendChild(colorStopElement);
    });

    // Setup listeners for new color stops
    this.setupColorStopListeners();
  }

  updateColorStop(index) {
    const colorStop = this.colorStopsContainer.children[index];
    const colorInput = colorStop.querySelector('input[type="color"]');

    this.colorStops[index].color = colorInput.value;
    this.updateGradient();
    this.saveSettings();
  }

  updateColorStopPosition(index) {
    const colorStop = this.colorStopsContainer.children[index];
    const rangeInput = colorStop.querySelector('input[type="range"]');
    const span = colorStop.querySelector("span");

    this.colorStops[index].position = parseInt(rangeInput.value);
    span.textContent = rangeInput.value + "%";

    this.updateGradient();
    this.saveSettings();
  }

  addColorStop() {
    const newStop = {
      color: "#ffffff",
      position: 50,
    };

    this.colorStops.push(newStop);
    this.renderColorStops();
    this.updateGradient();
    this.saveSettings();

    this.showToast("Color stop added", "success");
  }

  removeColorStop(index) {
    if (this.colorStops.length <= 2) {
      this.showToast("At least 2 color stops required", "error");
      return;
    }

    this.colorStops.splice(index, 1);
    this.renderColorStops();
    this.updateGradient();
    this.saveSettings();

    this.showToast("Color stop removed", "success");
  }

  updateGradient() {
    // Sort color stops by position
    const sortedStops = [...this.colorStops].sort(
      (a, b) => a.position - b.position
    );

    // Create gradient string
    const gradientStops = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    const angle = this.gradientAngleRange.value;
    const gradient = `linear-gradient(${angle}deg, ${gradientStops})`;

    this.gradientText.style.background = gradient;
    this.gradientText.style.backgroundSize = "400% 400%";
    this.gradientText.style.webkitBackgroundClip = "text";
    this.gradientText.style.webkitTextFillColor = "transparent";
    this.gradientText.style.backgroundClip = "text";
    this.gradientText.style.color = "transparent";
  }

  updateTypography() {
    const fontFamily = this.fontFamilySelect.value;
    const fontSize = this.fontSizeRange.value;
    const fontWeight = this.fontWeightRange.value;

    this.gradientText.style.fontFamily = fontFamily;
    this.gradientText.style.fontSize = fontSize + "px";
    this.gradientText.style.fontWeight = fontWeight;

    // Update range values display
    this.fontSizeRange.nextElementSibling.textContent = fontSize + "px";
    this.fontWeightRange.nextElementSibling.textContent = fontWeight;

    // Update stats
    document.getElementById("fontSize").textContent = fontSize + "px";

    this.saveSettings();
  }

  setGradientType(type) {
    // Remove active class from all type buttons
    document.querySelectorAll("[data-type]").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to selected type
    document.querySelector(`[data-type="${type}"]`).classList.add("active");

    // Update gradient type
    const angle = this.gradientAngleRange.value;
    let gradientPrefix;

    switch (type) {
      case "radial":
        gradientPrefix = "radial-gradient(circle";
        break;
      case "conic":
        gradientPrefix = `conic-gradient(from ${angle}deg`;
        break;
      default:
        gradientPrefix = `linear-gradient(${angle}deg`;
    }

    // Update gradient
    const sortedStops = [...this.colorStops].sort(
      (a, b) => a.position - b.position
    );
    const gradientStops = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    const gradient = `${gradientPrefix}, ${gradientStops})`;
    this.gradientText.style.background = gradient;
    this.gradientText.style.backgroundSize = "400% 400%";
    this.gradientText.style.webkitBackgroundClip = "text";
    this.gradientText.style.webkitTextFillColor = "transparent";
    this.gradientText.style.backgroundClip = "text";
    this.gradientText.style.color = "transparent";

    // Update stats
    document.getElementById("gradientType").textContent =
      this.capitalizeFirst(type);

    this.saveSettings();
  }

  updateAnimation() {
    const speed = this.animationSpeedRange.value;
    this.gradientText.style.animationDuration = speed + "s";

    // Update range value display
    this.animationSpeedRange.nextElementSibling.textContent = speed + "s";

    this.saveSettings();
  }

  toggleGlow() {
    const isEnabled = this.glowEffectToggle.checked;
    const glowEffect = document.querySelector(".glow-effect");

    if (glowEffect) {
      glowEffect.style.display = isEnabled ? "block" : "none";
    }

    this.saveSettings();
  }

  toggleReflection() {
    const isEnabled = this.reflectionEffectToggle.checked;
    const reflectionEffect = document.querySelector(".reflection-effect");

    if (reflectionEffect) {
      reflectionEffect.style.display = isEnabled ? "block" : "none";
    }

    this.saveSettings();
  }

  toggleShadow() {
    const isEnabled = this.shadowEffectToggle.checked;

    if (isEnabled) {
      this.gradientText.style.filter =
        "drop-shadow(0 0 30px rgba(83, 53, 207, 0.3))";
    } else {
      this.gradientText.style.filter = "none";
    }

    this.saveSettings();
  }

  updateGlow() {
    const intensity = this.glowIntensityRange.value;
    const glowEffect = document.querySelector(".glow-effect");

    if (glowEffect) {
      glowEffect.style.opacity = intensity / 100;
    }

    // Update range value display
    this.glowIntensityRange.nextElementSibling.textContent = intensity + "%";

    this.saveSettings();
  }

  updateTextStats() {
    const text = this.gradientText.textContent || this.gradientText.innerText;
    document.getElementById("charCount").textContent = text.length;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.currentTheme);

    // Update theme toggle icon
    const icon = document.querySelector("#themeToggle i");
    if (this.currentTheme === "light") {
      icon.className = "fas fa-moon";
    } else {
      icon.className = "fas fa-sun";
    }

    this.saveSettings();
    this.showToast(`Switched to ${this.currentTheme} theme`, "info");
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.showToast("Entered fullscreen mode", "info");
        document.querySelector("#fullscreenBtn i").className =
          "fas fa-compress";
      });
    } else {
      document.exitFullscreen().then(() => {
        this.showToast("Exited fullscreen mode", "info");
        document.querySelector("#fullscreenBtn i").className = "fas fa-expand";
      });
    }
  }

  showExportModal() {
    this.exportModal.classList.add("show");

    // Update preview
    const previewText = document.getElementById("previewText");
    previewText.textContent = this.gradientText.textContent;
    previewText.style.background = this.gradientText.style.background;
    previewText.style.fontFamily = this.gradientText.style.fontFamily;
    previewText.style.fontWeight = this.gradientText.style.fontWeight;

    // Generate CSS
    this.generateCSS();
  }

  hideExportModal() {
    this.exportModal.classList.remove("show");
  }

  generateCSS() {
    const styles = window.getComputedStyle(this.gradientText);
    const cssCode = `
.gradient-text {
    font-family: ${styles.fontFamily};
    font-size: ${styles.fontSize};
    font-weight: ${styles.fontWeight};
    background: ${this.gradientText.style.background};
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    display: inline-block;
    animation: gradientMove ${styles.animationDuration} linear infinite;
}

@keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Fallback for unsupported browsers */
@supports not (-webkit-background-clip: text) {
    .gradient-text {
        color: #5335cf;
        background: none;
        -webkit-text-fill-color: initial;
    }
}`;

    document.getElementById("cssCode").textContent = cssCode;
  }

  copyCSS() {
    const cssCode = document.getElementById("cssCode").textContent;
    navigator.clipboard
      .writeText(cssCode)
      .then(() => {
        this.showToast("CSS code copied to clipboard!", "success");
      })
      .catch(() => {
        this.showToast("Failed to copy CSS code", "error");
      });
  }

  exportAsPNG() {
    this.showLoading(true);

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const text = this.gradientText.textContent;
    const fontSize = parseInt(this.gradientText.style.fontSize);
    canvas.width = text.length * fontSize * 0.6;
    canvas.height = fontSize * 1.2;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    this.colorStops.forEach((stop) => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });

    // Draw text
    ctx.fillStyle = gradient;
    ctx.font = `${this.gradientText.style.fontWeight} ${fontSize}px ${this.gradientText.style.fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, canvas.height / 2);

    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gradient-text.png";
      a.click();
      URL.revokeObjectURL(url);

      this.showLoading(false);
      this.showToast("PNG exported successfully!", "success");
    });
  }

  exportAsSVG() {
    const text = this.gradientText.textContent;
    const fontSize = parseInt(this.gradientText.style.fontSize);

    // Create SVG
    const svg = `
<svg width="${text.length * fontSize * 0.6}" height="${
      fontSize * 1.2
    }" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            ${this.colorStops
              .map(
                (stop) =>
                  `<stop offset="${stop.position}%" stop-color="${stop.color}" />`
              )
              .join("")}
        </linearGradient>
    </defs>
    <text x="0" y="${fontSize}" font-family="${
      this.gradientText.style.fontFamily
    }"
          font-size="${fontSize}" font-weight="${
      this.gradientText.style.fontWeight
    }"
          fill="url(#gradient)">${text}</text>
</svg>`;

    // Download
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient-text.svg";
    a.click();
    URL.revokeObjectURL(url);

    this.showToast("SVG exported successfully!", "success");
  }

  exportAsCSS() {
    this.generateCSS();
    const cssCode = document.getElementById("cssCode").textContent;

    // Download
    const blob = new Blob([cssCode], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient-text.css";
    a.click();
    URL.revokeObjectURL(url);

    this.showToast("CSS exported successfully!", "success");
  }

  shareLink() {
    const settings = this.getSettings();
    const encoded = btoa(JSON.stringify(settings));
    const url = `${window.location.origin}${window.location.pathname}?settings=${encoded}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.showToast("Share link copied to clipboard!", "success");
      })
      .catch(() => {
        this.showToast("Failed to copy share link", "error");
      });
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "s":
          e.preventDefault();
          this.saveSettings();
          this.showToast("Settings saved!", "success");
          break;
        case "e":
          e.preventDefault();
          this.showExportModal();
          break;
        case "d":
          e.preventDefault();
          this.toggleTheme();
          break;
        case "f":
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    }

    if (e.key === "Escape") {
      if (this.exportModal.classList.contains("show")) {
        this.hideExportModal();
      }
    }
  }

  handleResize() {
    // Adjust particle count based on screen size
    const particles = document.querySelectorAll(".particle");
    const shouldShowParticles = window.innerWidth > 768;

    particles.forEach((particle) => {
      particle.style.display = shouldShowParticles ? "block" : "none";
    });
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon =
      type === "success" ? "check" : type === "error" ? "times" : "info";

    toast.innerHTML = `
            <i class="fas fa-${icon} toast-icon"></i>
            <span>${message}</span>
        `;

    this.toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add("show"), 100);

    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  showLoading(show) {
    if (show) {
      this.loadingOverlay.classList.add("show");
    } else {
      this.loadingOverlay.classList.remove("show");
    }
  }

  showWelcomeMessage() {
    setTimeout(() => {
      this.showToast("Welcome to Gradient Text Studio! 🎨", "success");
    }, 500);
  }

  saveSettings() {
    const settings = this.getSettings();
    localStorage.setItem("gradientTextStudio", JSON.stringify(settings));
  }

  loadSettings() {
    try {
      // Check for URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const encodedSettings = urlParams.get("settings");

      let settings;
      if (encodedSettings) {
        settings = JSON.parse(atob(encodedSettings));
      } else {
        const saved = localStorage.getItem("gradientTextStudio");
        settings = saved ? JSON.parse(saved) : null;
      }

      if (settings) {
        this.applySettings(settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  getSettings() {
    return {
      text: this.gradientText.textContent,
      fontFamily: this.fontFamilySelect.value,
      fontSize: this.fontSizeRange.value,
      fontWeight: this.fontWeightRange.value,
      gradientAngle: this.gradientAngleRange.value,
      animationSpeed: this.animationSpeedRange.value,
      glowEffect: this.glowEffectToggle.checked,
      reflectionEffect: this.reflectionEffectToggle.checked,
      shadowEffect: this.shadowEffectToggle.checked,
      glowIntensity: this.glowIntensityRange.value,
      colorStops: this.colorStops,
      currentGradient: this.currentGradient,
      theme: this.currentTheme,
    };
  }

  applySettings(settings) {
    // Apply text
    this.gradientText.textContent = settings.text || "Gradient Text Studio";

    // Apply typography
    this.fontFamilySelect.value = settings.fontFamily || "'Inter', sans-serif";
    this.fontSizeRange.value = settings.fontSize || 120;
    this.fontWeightRange.value = settings.fontWeight || 700;

    // Apply gradient settings
    this.gradientAngleRange.value = settings.gradientAngle || 135;
    this.animationSpeedRange.value = settings.animationSpeed || 3;

    // Apply effects
    this.glowEffectToggle.checked = settings.glowEffect !== false;
    this.reflectionEffectToggle.checked = settings.reflectionEffect || false;
    this.shadowEffectToggle.checked = settings.shadowEffect || false;
    this.glowIntensityRange.value = settings.glowIntensity || 50;

    // Apply color stops
    if (settings.colorStops) {
      this.colorStops = settings.colorStops;
      this.renderColorStops();
    }

    // Apply gradient preset
    if (settings.currentGradient) {
      this.selectPreset(settings.currentGradient);
    }

    // Apply theme
    if (settings.theme) {
      this.currentTheme = settings.theme;
      document.documentElement.setAttribute("data-theme", this.currentTheme);
      const icon = document.querySelector("#themeToggle i");
      if (this.currentTheme === "light") {
        icon.className = "fas fa-moon";
      } else {
        icon.className = "fas fa-sun";
      }
    }

    // Update UI
    this.updateTypography();
    this.updateGradient();
    this.updateAnimation();
    this.toggleGlow();
    this.toggleReflection();
    this.toggleShadow();
    this.updateGlow();
    this.updateTextStats();
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  window.gradientStudio = new GradientTextStudio();
});

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
