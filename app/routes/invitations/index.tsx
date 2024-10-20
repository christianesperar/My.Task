import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { useMutation } from '@tanstack/react-query'
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  ResizableTableContainer,
} from 'react-aria-components'
import axios from 'axios'

import { Status } from '@app/types/invitation'
import { InvitationResponse } from '@app/types/api'

import ProtectedRoute from '@app/components/ProtectedRoute'
import OButton from '@app/components/OButton'
import SwitchPermissions from '@app/components/SwitchPermissions'
import AlertDialog from '@app/components/AlertDialog'
import { axiosInstance, formatDate } from '@app/helpers'

const fetchInvitations = createServerFn('GET', async () => {
  const [invitationsByInviterResponse, invitationsByInviteeResponse] =
    await Promise.all([
      axiosInstance().get('/api/invitations?filterBy=inviter'),
      axiosInstance().get('/api/invitations?filterBy=invitee'),
    ])

  return {
    invitationsByInviter:
      invitationsByInviterResponse.data as InvitationResponse[],
    invitationsByInvitee:
      invitationsByInviteeResponse.data as InvitationResponse[],
  }
})

export const Route = createFileRoute('/invitations/')({
  component: () => (
    <ProtectedRoute>
      <ManageInvitesPage />
    </ProtectedRoute>
  ),
  loader: async () => await fetchInvitations(),
})

function ManageInvitesPage() {
  const navigate = useNavigate()
  const state = Route.useLoaderData()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [userToDelete, setUserToDelete] = useState<InvitationResponse>()
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/api/invitations/${id}`, { withCredentials: true })
    },
    onSuccess: () => {
      navigate({ to: '/invitations' })
    },
  })

  const handleDelete = async (user: InvitationResponse) => {
    setUserToDelete(user)
    setShowConfirmation(true)
  }

  const handleProceed = () => {
    if (!userToDelete) return

    deleteMutation.mutate(userToDelete.id)
    setShowConfirmation(false)
  }

  const isDeletingUser = (id: string) =>
    userToDelete?.id === id && deleteMutation.isPending

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <>
      <Tabs>
        <TabList aria-label="Manage Invites">
          <Tab id="given">Given</Tab>
          <Tab id="received">Received</Tab>
        </TabList>

        <TabPanel id="given">
          <div className="mb-4 flex justify-end">
            <OButton onPress={() => navigate({ to: '/invitations/add' })}>
              Invite User
            </OButton>
          </div>

          {/* Use ResizableTableContainer as I am unable to adjust the width of the Table component for some reason */}
          <ResizableTableContainer>
            <Table aria-label="Invitations" selectionMode="multiple">
              <TableHeader>
                <Column isRowHeader>Invitee</Column>
                <Column>Invited On</Column>
                <Column width={90}>Status</Column>
                <Column width={122}>Actions</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => 'No results found.'}>
                {state.invitationsByInviter.map((user) => (
                  <React.Fragment key={user.id}>
                    <Row>
                      <Cell>{user.inviteeEmail}</Cell>
                      <Cell>{formatDate(user.createdAt)}</Cell>
                      <Cell>{user.status}</Cell>
                      <Cell>
                        <div className="flex justify-end">
                          {[Status.Pending, Status.Accepted].includes(
                            user.status,
                          ) && (
                            <span className="mr-1">
                              <OButton
                                isPending={isDeletingUser(user.id)}
                                isDisabled={isDeletingUser(user.id)}
                                onPress={() => handleDelete(user)}
                              >
                                Delete
                              </OButton>
                            </span>
                          )}
                          <OButton
                            variant="text"
                            onPress={() => handleToggleRow(user.id)}
                          >
                            {expandedRows.has(user.id) ? '▲' : '▼'}
                          </OButton>{' '}
                        </div>
                      </Cell>
                    </Row>
                    {expandedRows.has(user.id) && (
                      <Row className="relative h-[200px]">
                        <Cell className="absolute">
                          <div className="p-4 pt-1 text-base">
                            <SwitchPermissions
                              selectedPermissions={user.permissions}
                              onChange={() => {}}
                            />
                          </div>
                        </Cell>
                        <Cell />
                        <Cell />
                        <Cell />
                      </Row>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ResizableTableContainer>
        </TabPanel>

        <TabPanel id="received">
          {/* Use ResizableTableContainer as I am unable to adjust the width of the Table component for some reason */}
          <ResizableTableContainer>
            <Table aria-label="Invitations" selectionMode="multiple">
              <TableHeader>
                <Column isRowHeader>Inviter</Column>
                <Column>Invited On</Column>
                <Column width={90}>Status</Column>
                <Column width={192}>Actions</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => 'No results found.'}>
                {state.invitationsByInvitee.map((user) => (
                  <React.Fragment key={user.id}>
                    <Row>
                      <Cell>{user.inviterEmail}</Cell>
                      <Cell>{formatDate(user.createdAt)}</Cell>
                      <Cell>{user.status}</Cell>
                      <Cell>
                        <div className="flex justify-end">
                          {user.status === Status.Pending && (
                            <>
                              <span className="mr-1">
                                <OButton>Accept</OButton>
                              </span>

                              <OButton>Reject</OButton>
                            </>
                          )}

                          <OButton
                            variant="text"
                            onPress={() => handleToggleRow(user.id)}
                          >
                            {expandedRows.has(user.id) ? '▲' : '▼'}
                          </OButton>
                        </div>
                      </Cell>
                    </Row>
                    {expandedRows.has(user.id) && (
                      <Row className="relative h-[200px]">
                        <Cell className="absolute">
                          <div className="p-4 pt-1 text-base">
                            <SwitchPermissions
                              selectedPermissions={user.permissions}
                              onChange={() => {}}
                            />
                          </div>
                        </Cell>
                        <Cell />
                        <Cell />
                        <Cell />
                      </Row>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ResizableTableContainer>
        </TabPanel>

        <AlertDialog
          isOpen={showConfirmation}
          onProceed={handleProceed}
          onCancel={() => setShowConfirmation(false)}
        >
          <p className="mb-2">Are you sure you want to proceed?</p>

          <p>
            This will delete <strong>{userToDelete?.inviteeEmail}</strong>.
          </p>
        </AlertDialog>
      </Tabs>
    </>
  )
}
