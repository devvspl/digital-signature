$(document).ready(function () {
    const $canvas = $("#signatureCanvas");
    const canvas = $canvas[0];
    const ctx = canvas.getContext("2d");
    const $clearBtn = $("#clearBtn");
    const $undoBtn = $("#undoBtn");
    const $redoBtn = $("#redoBtn");
    const $saveBtn = $("#saveBtn");
    const $savedImage = $("#savedImage");
    const $downloadLink = $("#downloadLink");

    let isDrawing = false;
    let drawHistory = [];
    let historyIndex = -1;

    canvas.width = $canvas.width();
    canvas.height = $canvas.height();

    $canvas.on("mousedown", function (e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    $canvas.on("mousemove", function (e) {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    $canvas.on("mouseup mouseleave", function () {
        isDrawing = false;
        saveState();
    });

    function saveState() {
        if (historyIndex < drawHistory.length - 1) {
            drawHistory = drawHistory.slice(0, historyIndex + 1);
        }
        drawHistory.push(canvas.toDataURL());
        historyIndex++;
    }

    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            const previousState = drawHistory[historyIndex];
            const img = new Image();
            img.src = previousState;
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    function redo() {
        if (historyIndex < drawHistory.length - 1) {
            historyIndex++;
            const nextState = drawHistory[historyIndex];
            const img = new Image();
            img.src = nextState;
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }

    $clearBtn.on("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $savedImage.hide();
        drawHistory = [];
        historyIndex = -1;
    });

    $undoBtn.on("click", function () {
        undo();
    });

    $redoBtn.on("click", function () {
        redo();
    });

    $saveBtn.on("click", function () {
        const dataURL = canvas.toDataURL("image/png");

        $savedImage.attr("src", dataURL).show();

        $downloadLink.attr("href", dataURL);
        $downloadLink.attr("download", `signature_${Date.now()}.png`);

        $downloadLink[0].click();
    });
});
