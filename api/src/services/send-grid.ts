import client from '@sendgrid/client'

client.setApiKey(process.env.SENDGRID_API_KEY as string)

type SendEmailOptions = {
  template: string
  props?: Record<string, string>
  to: string
}

enum Templates {
  inviteCollaborator = 'd-4480ab70c32f4d66b5826fbb6843dd5b',
}

const sendEmail = async ({ to, template, props = {} }: SendEmailOptions) => {
  return client.request({
    body: {
      template_id: template,
      from: {
        email: 'no-reply@presearch.co',
        name: 'Presearch',
      },
      personalizations: [
        {
          subject: 'Hello, World!',
          to: [{ email: to }],
          dynamic_template_data: props,
        },
      ],
    },
    method: 'POST',
    url: '/v3/mail/send',
  })
}

export const sendInvitation = ({ to, project, referrer }) => {
  return sendEmail({
    to,
    template: Templates.inviteCollaborator,
    props: {
      REFERRER: referrer.name,
      PROJECT_NAME: project.name,
      PROJECT_LINK: `${process.env.FRONTEND_ENDPOINT}/project/${project.id}`,
    },
  })
}
