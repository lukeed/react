import React from 'react'
import styled from 'styled-components'
import {RelativeTimeElement} from '@github/relative-time-element'
import {createComponent} from '@lit-labs/react'
import {ComponentProps} from '../utils/types'
import sx from '../sx'

const RelativeTimeComponent = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)

export type RelativeTimeProps = ComponentProps<typeof RelativeTimeComponent>

const localeOptions: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric', year: 'numeric'}
function RelativeTime(props: RelativeTimeProps) {
  return (
    <RelativeTimeComponent {...props}>
      ${props.date?.toLocaleDateString('en', localeOptions) || ''}
    </RelativeTimeComponent>
  )
}

export default RelativeTime
