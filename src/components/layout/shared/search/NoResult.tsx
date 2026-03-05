// React Router Imports
import { Link } from 'react-router-dom'

// Third-party Imports
import classnames from 'classnames'

type NoResultData = {
  label: string
  href: string
  icon: string
}

const noResultData: NoResultData[] = [
  {
    label: 'Overview',
    href: '/',
    icon: 'ri-dashboard-line'
  },
  {
    label: 'My Station',
    href: '/stations',
    icon: 'ri-building-line'
  },
  {
    label: 'Investment Report',
    href: '/reports',
    icon: 'ri-file-chart-line'
  }
]

const NoResult = ({ searchValue, setOpen }: { searchValue: string; setOpen: (value: boolean) => void }) => {
  return (
    <div className='flex items-center justify-center grow flex-wrap plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      <div className='flex flex-col items-center'>
        <i className='ri-file-forbid-line text-[64px] mbe-2.5' />
        <p className='text-xl mbe-11'>{`No result for "${searchValue}"`}</p>
        <p className='mbe-[18px] text-textDisabled'>Try searching for</p>
        <ul className='flex flex-col gap-4'>
          {noResultData.map((item, index) => (
            <li key={index} className='flex items-center'>
              <Link
                to={item.href}
                className='flex items-center gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                onClick={() => setOpen(false)}
              >
                <i className={classnames(item.icon, 'text-xl')} />
                <p className='overflow-hidden whitespace-nowrap overflow-ellipsis'>{item.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NoResult

