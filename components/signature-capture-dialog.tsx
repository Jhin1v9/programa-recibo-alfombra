"use client";

import { useEffect, useMemo, useRef } from "react";

import { buttonClasses } from "@/components/workspace-ui";

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 280;
const SIGNATURE_INK = "#111111";
const SIGNATURE_STROKE = 5.4;

type SignatureCaptureDialogProps = {
  open: boolean;
  title: string;
  description: string;
  signerName?: string;
  initialValue?: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  labels: {
    clear: string;
    cancel: string;
    save: string;
    empty: string;
    sheetTitle: string;
    sheetNote: string;
  };
};

export function SignatureCaptureDialog({
  open,
  title,
  description,
  signerName,
  initialValue,
  onClose,
  onSave,
  labels
}: Readonly<SignatureCaptureDialogProps>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasStrokeRef = useRef(false);
  const emptyMessage = useMemo(() => labels.empty, [labels.empty]);

  function primeCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = SIGNATURE_STROKE;
    context.strokeStyle = SIGNATURE_INK;
    context.imageSmoothingEnabled = true;
  }

  useEffect(() => {
    if (!open || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    primeCanvas(context, canvas);

    if (!initialValue) {
      hasStrokeRef.current = false;
      return;
    }

    const image = new Image();
    image.onload = () => {
      primeCanvas(context, canvas);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      hasStrokeRef.current = true;
    };
    image.src = initialValue;
  }, [initialValue, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  function getContext() {
    return canvasRef.current?.getContext("2d") || null;
  }

  function mapPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = getContext();

    if (!canvas || !context) {
      return;
    }

    event.preventDefault();
    const point = mapPoint(event);
    pointerIdRef.current = event.pointerId;
    lastPointRef.current = point;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + 0.01, point.y + 0.01);
    context.stroke();
    hasStrokeRef.current = true;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = getContext();

    if (!context || pointerIdRef.current !== event.pointerId || !lastPointRef.current) {
      return;
    }

    event.preventDefault();
    const point = mapPoint(event);
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  }

  function stopDrawing(event?: React.PointerEvent<HTMLCanvasElement>) {
    if (event && canvasRef.current && pointerIdRef.current === event.pointerId) {
      canvasRef.current.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;
    lastPointRef.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = getContext();

    if (!canvas || !context) {
      return;
    }

    primeCanvas(context, canvas);
    hasStrokeRef.current = false;
  }

  function handleSave() {
    const canvas = canvasRef.current;

    if (!canvas || !hasStrokeRef.current) {
      window.alert(emptyMessage);
      return;
    }

    onSave(canvas.toDataURL("image/png"));
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/48 p-2 backdrop-blur-sm sm:p-3 md:p-6">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-1.5rem)]">
        <div className="border-b border-[color:var(--line)] px-4 py-4 md:px-6">
          <h2 className="text-xl font-extrabold text-[color:var(--ink)]">{title}</h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-7 text-[color:var(--ink-soft)]">
            {description}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-6">
          <div className="rounded-[24px] border-2 border-dashed border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-3 md:p-4">
            <div className="mb-3 grid gap-3 rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                  {labels.sheetTitle}
                </p>
                <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                  {labels.sheetNote}
                </p>
              </div>
              <div className="signature-script break-words text-right text-[1.2rem] leading-none text-[color:var(--ink)] sm:text-[1.7rem]">
                {signerName || title}
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className="h-[180px] w-full touch-none rounded-[18px] bg-white sm:h-[250px]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              onPointerCancel={stopDrawing}
            />
          </div>
        </div>

        <div className="mobile-safe-footer border-t border-[color:var(--line)] bg-white px-3 py-3 md:px-6 md:py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <button type="button" className={buttonClasses("ghost")} onClick={clearCanvas}>
              {labels.clear}
            </button>
            <button type="button" className={buttonClasses("ghost")} onClick={onClose}>
              {labels.cancel}
            </button>
            <button
              type="button"
              className={`${buttonClasses("primary")} col-span-2 sm:col-span-1`}
              onClick={handleSave}
            >
              {labels.save}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
