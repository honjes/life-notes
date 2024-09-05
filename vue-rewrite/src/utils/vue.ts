import { toastController } from "@ionic/vue"

export async function createToast(messages: string, duration: number, type: "error" | "success" | "warning" | "info") {
  const toast = await toastController.create({
    message: messages,
    position: "bottom",
    duration: duration,
    cssClass: `toast-${type}`,
  })
  toast.present()
}
