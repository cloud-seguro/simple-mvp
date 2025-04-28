import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import MessageThread from "@/components/contrata/message-thread";
import { format } from "date-fns";
import Image from "next/image";

export const metadata = {
  title: "Engagement Details | CONTRATA | SIMPLE",
  description: "View details of your specialist engagement",
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

// Helper function to get status badge styling
const getStatusBadgeClass = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-accent text-accent-foreground";
    case "ACCEPTED":
      return "bg-accent text-accent-foreground";
    case "REJECTED":
      return "bg-destructive/10 text-destructive";
    case "IN_PROGRESS":
      return "bg-primary/10 text-primary";
    case "COMPLETED":
      return "bg-[hsl(var(--chart-2))] text-white";
    case "CANCELLED":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default async function EngagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const engagementId = (await params).id;

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Get the user's profile to check their role
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, role: true },
  });

  // If not a PREMIUM or SUPERADMIN user, redirect to dashboard
  if (
    !profile ||
    (profile.role !== UserRole.PREMIUM && profile.role !== UserRole.SUPERADMIN)
  ) {
    redirect("/dashboard");
  }

  // Fetch engagement details
  const engagement = await prisma.engagement.findUnique({
    where: {
      id: engagementId,
      profileId: profile.id, // Ensure the engagement belongs to the user
    },
    include: {
      specialist: true,
      deal: true,
      messages: {
        orderBy: {
          sentAt: "asc",
        },
      },
    },
  });

  if (!engagement) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/contrata/engagements"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to all engagements
      </Link>

      <div className="bg-card rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{engagement.title}</h1>
              <div className="flex items-center mb-4">
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(engagement.status)}`}
                >
                  {engagement.status.replace(/_/g, " ")}
                </span>
                <span className="text-muted-foreground text-sm ml-4">
                  Created:{" "}
                  {format(new Date(engagement.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Status actions based on current status */}
            <div className="mt-4 md:mt-0">
              {engagement.status === "PENDING" && (
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition">
                  Cancel Request
                </button>
              )}
              {engagement.status === "ACCEPTED" && (
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-[hsl(var(--chart-2))] text-white rounded-md hover:bg-[hsl(var(--chart-2))/90] transition">
                    Make Payment
                  </button>
                  <button className="w-full px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition">
                    Cancel
                  </button>
                </div>
              )}
              {engagement.status === "IN_PROGRESS" && (
                <button className="px-4 py-2 bg-[hsl(var(--chart-2))] text-white rounded-md hover:bg-[hsl(var(--chart-2))/90] transition">
                  Mark as Completed
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row">
            <div className="md:w-2/3 md:pr-8">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-foreground whitespace-pre-line mb-6">
                {engagement.description}
              </p>

              {engagement.deal && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Selected Package
                  </h2>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">{engagement.deal.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Price: ${engagement.deal.price} • Duration:{" "}
                      {engagement.deal.durationDays} days
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                {engagement.budget && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Budget
                    </h3>
                    <p className="font-semibold">${engagement.budget}</p>
                  </div>
                )}
                {engagement.startDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </h3>
                    <p className="font-semibold">
                      {format(new Date(engagement.startDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
                {engagement.endDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      End Date
                    </h3>
                    <p className="font-semibold">
                      {format(new Date(engagement.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Specialist</h2>
                <div className="flex items-center mb-4">
                  {engagement.specialist.imageUrl ? (
                    <Image
                      src={engagement.specialist.imageUrl}
                      alt={engagement.specialist.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted mr-4 flex items-center justify-center text-muted-foreground">
                      <span className="text-xl">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {engagement.specialist.name}
                    </h3>
                    {engagement.specialist.location && (
                      <p className="text-sm text-muted-foreground">
                        {engagement.specialist.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {engagement.specialist.expertiseAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {area.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-muted-foreground"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{engagement.specialist.contactEmail}</span>
                  </p>
                  {engagement.specialist.contactPhone && (
                    <p className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{engagement.specialist.contactPhone}</span>
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/contrata/specialists/${engagement.specialist.id}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View Specialist Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Thread Component */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Messages</h2>
          <MessageThread engagementId={engagement.id} profileId={profile.id} />
        </div>
      </div>
    </div>
  );
}
