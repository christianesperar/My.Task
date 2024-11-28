import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { useMutation } from '@tanstack/react-query'
import {
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Form,
  FieldError,
} from 'react-aria-components'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { UserResponse } from '@app/types/api'
import { invitationSchema, InvitationData } from '@app/schemas/invitation'

import { useAuth } from '@app/hooks/useAuth'
import ProtectedRoute from '@app/components/ProtectedRoute'
import OButton from '@app/components/OButton'
import SwitchPermissions from '@app/components/SwitchPermissions'
import AlertDialog from '@app/components/AlertDialog'
import { axiosInstance } from '@app/helpers'

const fetchUsers = createServerFn('GET', async () => {
  const usersResponse = await axiosInstance().get<UserResponse[]>(`/api/users`)

  return {
    users: usersResponse.data,
  }
})

export const Route = createFileRoute('/invitations/add')({
  component: () => (
    <ProtectedRoute>
      <InviteUserPage />
    </ProtectedRoute>
  ),
  loader: async () => {
    try {
      return await fetchUsers()
    } catch {
      throw redirect({
        to: '/',
        search: {
          lastUrl: '/invitations/add',
        },
      })
    }
  },
})

function InviteUserPage() {
  const { getUserToken } = useAuth()
  const state = Route.useLoaderData()
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

  const addMutation = useMutation({
    mutationFn: (formData: InvitationData) => {
      return axios.post('/api/invitations', formData, { withCredentials: true })
    },
    onSuccess: () => {
      navigate({ to: '/invitations' })
    },
  })

  const { control, handleSubmit, getValues } = useForm<InvitationData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      inviteeId: '',
      permissions: [],
    },
  })

  const onSubmit = () => {
    setShowConfirmation(true)
  }

  const handleProceed = () => {
    setShowConfirmation(false)
    addMutation.mutate(getValues())
  }

  return (
    <>
      <div className="mt-24 flex justify-center">
        <div className="flex flex-col items-center [&_.react-aria-TextField]:w-full">
          <h1 className="text-3xl mb-6">Invite Users</h1>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {addMutation.isError && (
              <div role="alert" tabIndex={-1}>
                <h3>Invite Failed</h3>
                <p>User already invited.</p>
              </div>
            )}

            <Controller
              name="inviteeId"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <ComboBox
                    {...field}
                    onSelectionChange={field.onChange}
                    isInvalid={fieldState.invalid}
                  >
                    <Label>Email</Label>

                    <div>
                      <Input />
                      <OButton>▼</OButton>
                    </div>
                    <Popover>
                      <ListBox>
                        {state.users
                          .filter(({ id }) => id !== getUserToken())
                          .map((item) => (
                            <ListBoxItem id={item.id} key={item.id}>
                              {item.email}
                            </ListBoxItem>
                          ))}
                      </ListBox>
                    </Popover>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </ComboBox>
                </>
              )}
            />

            <Controller
              name="permissions"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <SwitchPermissions
                    selectedPermissions={field.value}
                    isInvalid={fieldState.invalid}
                    onChange={field.onChange}
                  >
                    {/* <FieldError /> alternative */}
                    <>{fieldState.error?.message}</>
                  </SwitchPermissions>
                </>
              )}
            />

            <div className="w-full flex justify-between items-center">
              <OButton
                variant="outlined"
                onPress={() => navigate({ to: '/invitations' })}
              >
                Back
              </OButton>
              <OButton
                type="submit"
                isPending={addMutation.isPending}
                isDisabled={addMutation.isPending}
              >
                Invite User
              </OButton>
            </div>
          </Form>

          <AlertDialog
            isOpen={showConfirmation}
            onProceed={handleProceed}
            onCancel={() => setShowConfirmation(false)}
          >
            <>
              <p className="mb-2">Are you sure you want to proceed?</p>
              <p>
                This will invite{' '}
                <strong>
                  {
                    state.users.find(({ id }) => id === getValues('inviteeId'))
                      ?.email
                  }
                </strong>{' '}
                with following permission(s):
              </p>
              <ul>
                {getValues('permissions').map((permission) => (
                  <li key={permission}>
                    - <span className="font-semibold">{permission}</span>
                  </li>
                ))}
              </ul>
            </>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}
