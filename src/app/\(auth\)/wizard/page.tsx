import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WizardShell from "@/components/wizard/WizardShell";

export const metadata = {
  title: "Build Your Site - Safahati",
  description: "Create your website in just 5 minutes with our guided wizard.",
};

export default async function WizardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <WizardShell />
    </div>
  );
}
