import * as React from 'react'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import List from '@mui/joy/List'
import ListSubheader from '@mui/joy/ListSubheader'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemButton from '@mui/joy/ListItemButton'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import { closeSidebar } from '../utils'
import {
  BarChart,
  Bolt,
  Dashboard,
  Logout,
  Notifications,
  Person,
  SettingsRemoteOutlined,
  SettingsSuggest,
  Star,
  TextSnippet,
} from '@mui/icons-material'
import { useVault } from '@renderer/hooks/useVault'

export default function SecondSidebar() {
  const { vaultState } = useVault()

  return (
    <React.Fragment>
      <Box
        className="SecondSidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.body',
          opacity: 'calc(var(--SideNavigation-slideIn, 0) - 0.2)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Sheet
        className="SecondSidebar"
        sx={{
          position: {
            xs: 'fixed',
            lg: 'sticky',
          },
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))',
            lg: 'none',
          },
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.4s',
          zIndex: 9999,
          height: '100dvh',
          top: 0,
          p: 2,
          py: 3,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <List
          sx={{
            '--ListItem-radius': '8px',
            '--ListItem-minHeight': '32px',
            '--List-gap': '4px',
          }}
        >
          <ListSubheader role="presentation" sx={{ color: 'text.primary' }}>
            {vaultState.name}
          </ListSubheader>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <Dashboard />
              </ListItemDecorator>
              <ListItemContent>Overview</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton selected variant="soft" onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <TextSnippet />
              </ListItemDecorator>
              <ListItemContent>Secure Notes</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <BarChart />
              </ListItemDecorator>
              <ListItemContent>Analytics</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <Notifications />
              </ListItemDecorator>
              <ListItemContent>Notifications</ListItemContent>
              <Chip variant="soft" size="sm">
                10
              </Chip>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <Star />
              </ListItemDecorator>
              <ListItemContent>Saved reports</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <Bolt />
              </ListItemDecorator>
              <ListItemContent>Zaps & Boosts</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <Person />
              </ListItemDecorator>
              <ListItemContent>Backer reports</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => closeSidebar()}>
              <ListItemDecorator>
                <SettingsSuggest />
              </ListItemDecorator>
              <ListItemContent>Manage notifications</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          sx={{
            '--ListItem-radius': '8px',
            '--ListItem-minHeight': '32px',
            '--List-gap': '4px',
          }}
        >
          <ListSubheader sx={{ color: 'text.primary' }}>Connected Devices:</ListSubheader>
          {vaultState.peerNames?.map?.((name) => (
            <ListItem key={name}>
              <ListItemButton onClick={() => closeSidebar()}>
                <ListItemDecorator>
                  <SettingsRemoteOutlined />
                </ListItemDecorator>
                <ListItemContent>{name}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ pl: 1, mt: 'auto', display: 'flex', alignItems: 'center' }}>
          <div>
            <Typography fontWeight="lg" level="body2">
              Olivia Ryhe
            </Typography>
            <Typography level="body2">olivia@nostrverified.com</Typography>
            <Typography level="body4">npub1k86anutkqszjqz8tv4zu9curnqw2p...</Typography>
          </div>
          <IconButton variant="plain" sx={{ ml: 'auto' }}>
            <Logout />
          </IconButton>
        </Box>
      </Sheet>
    </React.Fragment>
  )
}
