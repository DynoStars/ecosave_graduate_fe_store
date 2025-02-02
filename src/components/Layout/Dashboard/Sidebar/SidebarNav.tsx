
import {
  faChartPie,
  faGauge,
  faBox, // Icon cho Product Management
  faFileAlt, // Icon cho Order Management
  faTag, // Icon cho Discount Management
  faStore, // Icon cho Store Information
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

export default async function SidebarNav() {
  const dict = await getDictionary()
  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
        <small className="ms-auto"><Badge bg="info" className="ms-auto">NEW</Badge></small>
      </SidebarNavItem>
      <SidebarNavItem icon={faBox} href="/#">
        {dict.sidebar.items.productManagement}
      </SidebarNavItem>
      <SidebarNavItem icon={faChartPie} href="/#">
        {dict.sidebar.items.revenueStatistics}
      </SidebarNavItem>
      <SidebarNavItem icon={faFileAlt} href="/#">
        {dict.sidebar.items.orderManagement}
      </SidebarNavItem>
      <SidebarNavItem icon={faTag} href="/#">
        {dict.sidebar.items.discountManagement}
      </SidebarNavItem>
      <SidebarNavItem icon={faStore} href="/#">
        {dict.sidebar.items.storeInformation}
      </SidebarNavItem>
    </ul>
  )
}
