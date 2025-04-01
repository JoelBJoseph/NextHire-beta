/**
 * API utility functions for data fetching
 */

// Base URL for API calls
const API_BASE_URL = typeof window !== "undefined" ? `${window.location.origin}/api` : "http://localhost:3000/api"

// Job Offers
export async function getJobOffers() {
  try {
    const response = await fetch(`${API_BASE_URL}/job-offers`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch job offers")
    return await response.json()
  } catch (error) {
    console.error("Error fetching job offers:", error)
    return []
  }
}

export async function getJobOfferById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-offers/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch job offer")
    return await response.json()
  } catch (error) {
    console.error(`Error fetching job offer with id ${id}:`, error)
    return null
  }
}

export async function createJobOffer(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to create job offer")
    return await response.json()
  } catch (error) {
    console.error("Error creating job offer:", error)
    throw error
  }
}

export async function updateJobOffer(id: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-offers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to update job offer")
    return await response.json()
  } catch (error) {
    console.error(`Error updating job offer with id ${id}:`, error)
    throw error
  }
}

export async function deleteJobOffer(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-offers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to delete job offer")
    return await response.json()
  } catch (error) {
    console.error(`Error deleting job offer with id ${id}:`, error)
    throw error
  }
}

// Applications
export async function getApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch applications")
    return await response.json()
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

export async function getApplicationById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch application")
    return await response.json()
  } catch (error) {
    console.error(`Error fetching application with id ${id}:`, error)
    return null
  }
}

export async function createApplication(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to create application")
    return await response.json()
  } catch (error) {
    console.error("Error creating application:", error)
    throw error
  }
}

export async function updateApplication(id: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to update application")
    return await response.json()
  } catch (error) {
    console.error(`Error updating application with id ${id}:`, error)
    throw error
  }
}

// Dashboard Data
export async function getDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch dashboard data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    // Return empty data structure instead of mock data
    return {
      totalApplications: 0,
      pendingApplications: 0,
      selectedApplications: 0,
      rejectedApplications: 0,
      totalJobs: 0,
      activeJobs: 0,
      totalStudents: 0,
      recentApplications: [],
      upcomingEvents: [],
    }
  }
}

// Profile
export async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch user profile")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function updateUserProfile(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to update user profile")
    return await response.json()
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Education
export async function addEducation(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/education`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to add education")
    return await response.json()
  } catch (error) {
    console.error("Error adding education:", error)
    throw error
  }
}

export async function deleteEducation(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/education/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to delete education")
    return await response.json()
  } catch (error) {
    console.error(`Error deleting education with id ${id}:`, error)
    throw error
  }
}

// Experience
export async function addExperience(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to add experience")
    return await response.json()
  } catch (error) {
    console.error("Error adding experience:", error)
    throw error
  }
}

export async function deleteExperience(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/experience/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error("Failed to delete experience")
    return await response.json()
  } catch (error) {
    console.error(`Error deleting experience with id ${id}:`, error)
    throw error
  }
}

// Contact Form
export async function submitContactForm(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to submit contact form")
    return await response.json()
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw error
  }
}

// Help & Support
export async function submitSupportRequest(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Failed to submit support request")
    return await response.json()
  } catch (error) {
    console.error("Error submitting support request:", error)
    throw error
  }
}

