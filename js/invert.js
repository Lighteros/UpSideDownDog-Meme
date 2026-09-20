(() => {
  const canvas = document.getElementById("rise-field");
  const well = document.getElementById("cursor-well");
  const menuBtn = document.getElementById("menu-btn");
  const links = document.getElementById("links");
  const addArc = document.getElementById("add-arc");

  const ctx = canvas.getContext("2d", { alpha: true });
  const marks = [];
  const COUNT = 46;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const spawn = () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * canvas.height,
    r: 0.6 + Math.random() * 1.8,
    v: 0.25 + Math.random() * 0.75,
    a: 0.12 + Math.random() * 0.35,
    gold: Math.random() > 0.78,
  });

  const drawMark = (p) => {
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.gold ? "#e3b56a" : "#8ef0b4";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    if (p.r > 1.4) {
      ctx.font = `${8 + p.r * 3}px Figtree, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("$", p.x, p.y - 4);
    }
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    marks.forEach((p, i) => {
      p.y -= p.v;
      p.x += Math.sin((p.y + i) * 0.01) * 0.25;
      if (p.y < -20) Object.assign(p, spawn(), { y: canvas.height + 12 });
      drawMark(p);
    });
    requestAnimationFrame(tick);
  };

  resize();
  for (let i = 0; i < COUNT; i += 1) marks.push(spawn());
  window.addEventListener("resize", () => {
    resize();
  });
  tick();

  window.addEventListener("pointermove", (event) => {
    well.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  menuBtn.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });

  document.querySelectorAll(".tug").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const box = el.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("seen");
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".rise").forEach((node) => reveal.observe(node));

  addArc.addEventListener("click", async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank", "noopener");
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13B2",
            chainName: "Arc",
            nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
            rpcUrls: ["https://rpc.mainnet.arc.io"],
            blockExplorerUrls: ["https://explorer.arc.io"],
          },
        ],
      });
    } catch (error) {
      console.warn(error);
    }
  });
})();
