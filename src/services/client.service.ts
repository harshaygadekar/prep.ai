import { auth, clerkClient } from '@clerk/nextjs/server'

export class ClientService {
  /**
   * Get current user information
   */
  static async getCurrentUser() {
    try {
      const { userId, orgId } = await auth()

      if (!userId) {
        throw new Error('User not authenticated')
      }

      const user = await (await clerkClient()).users.getUser(userId)

      return {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
        orgId: orgId || null
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
      throw error
    }
  }

  /**
   * Get organization by ID
   */
  static async getOrganizationById(orgId: string) {
    try {
      const organization = await (await clerkClient()).organizations.getOrganization({
        organizationId: orgId
      })

      return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        imageUrl: organization.imageUrl,
        createdAt: organization.createdAt,
        membersCount: organization.membersCount
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      throw error
    }
  }

  /**
   * Get user's organizations
   */
  static async getUserOrganizations(userId: string) {
    try {
      const response = await (await clerkClient()).users.getOrganizationMembershipList({
        userId
      })

      return response.data.map(membership => ({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        imageUrl: membership.organization.imageUrl,
        role: membership.role
      }))
    } catch (error) {
      console.error('Error fetching user organizations:', error)
      throw error
    }
  }

  /**
   * Get organization members
   */
  static async getOrganizationMembers(orgId: string) {
    try {
      const response = await (await clerkClient()).organizations.getOrganizationMembershipList({
        organizationId: orgId
      })

      return response.data.map(membership => ({
        userId: membership.publicUserData?.userId,
        email: membership.publicUserData?.identifier,
        firstName: membership.publicUserData?.firstName,
        lastName: membership.publicUserData?.lastName,
        imageUrl: membership.publicUserData?.imageUrl,
        role: membership.role,
        createdAt: membership.createdAt
      }))
    } catch (error) {
      console.error('Error fetching organization members:', error)
      throw error
    }
  }
}

export default ClientService
