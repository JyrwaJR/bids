import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar';
import { ScrollArea } from './ui/scroll-area';
const dummyData = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: '/avatars/01.png',
    amount: '+$1,999.00'
  },
  {
    id: 2,
    name: 'Liam Johnson',
    email: 'liam.johnson@email.com',
    avatar: '/avatars/02.png',
    amount: '+$1,250.00'
  },
  {
    id: 3,
    name: 'Emma Williams',
    email: 'emma.williams@email.com',
    avatar: '/avatars/03.png',
    amount: '+$3,450.00'
  },
  {
    id: 4,
    name: 'Noah Brown',
    email: 'noah.brown@email.com',
    avatar: '/avatars/04.png',
    amount: '+$850.00'
  },
  {
    id: 5,
    name: 'Ava Davis',
    email: 'ava.davis@email.com',
    avatar: '/avatars/05.png',
    amount: '+$1,540.00'
  },
  {
    id: 6,
    name: 'Sophia Wilson',
    email: 'sophia.wilson@email.com',
    avatar: '/avatars/06.png',
    amount: '+$2,300.00'
  },
  {
    id: 7,
    name: 'James Taylor',
    email: 'james.taylor@email.com',
    avatar: '/avatars/07.png',
    amount: '+$1,120.00'
  },
  {
    id: 8,
    name: 'Isabella Moore',
    email: 'isabella.moore@email.com',
    avatar: '/avatars/08.png',
    amount: '+$940.00'
  },
  {
    id: 9,
    name: 'Alexander Anderson',
    email: 'alexander.anderson@email.com',
    avatar: '/avatars/09.png',
    amount: '+$4,200.00'
  },
  {
    id: 10,
    name: 'Mia Thomas',
    email: 'mia.thomas@email.com',
    avatar: '/avatars/10.png',
    amount: '+$3,100.00'
  },
  {
    id: 11,
    name: 'Ethan Martinez',
    email: 'ethan.martinez@email.com',
    avatar: '/avatars/11.png',
    amount: '+$2,450.00'
  },
  {
    id: 12,
    name: 'Amelia Jackson',
    email: 'amelia.jackson@email.com',
    avatar: '/avatars/12.png',
    amount: '+$1,780.00'
  },
  {
    id: 13,
    name: 'Lucas White',
    email: 'lucas.white@email.com',
    avatar: '/avatars/13.png',
    amount: '+$1,620.00'
  },
  {
    id: 14,
    name: 'Charlotte Harris',
    email: 'charlotte.harris@email.com',
    avatar: '/avatars/14.png',
    amount: '+$2,890.00'
  },
  {
    id: 15,
    name: 'Mason Clark',
    email: 'mason.clark@email.com',
    avatar: '/avatars/15.png',
    amount: '+$1,900.00'
  },
  {
    id: 16,
    name: 'Harper Lewis',
    email: 'harper.lewis@email.com',
    avatar: '/avatars/16.png',
    amount: '+$3,300.00'
  },
  {
    id: 17,
    name: 'Logan Walker',
    email: 'logan.walker@email.com',
    avatar: '/avatars/17.png',
    amount: '+$1,700.00'
  },
  {
    id: 18,
    name: 'Ella Hall',
    email: 'ella.hall@email.com',
    avatar: '/avatars/18.png',
    amount: '+$2,450.00'
  },
  {
    id: 19,
    name: 'Aiden King',
    email: 'aiden.king@email.com',
    avatar: '/avatars/19.png',
    amount: '+$2,150.00'
  },
  {
    id: 20,
    name: 'Scarlett Green',
    email: 'scarlett.green@email.com',
    avatar: '/avatars/20.png',
    amount: '+$2,000.00'
  }
];

export function RecentSales() {
  return (
    <ScrollArea className="">
      <div className="max-h-80 space-y-8">
        {dummyData.map((item, i) => (
          <div key={i} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={item.avatar} alt="Avatar" />
              <AvatarFallback>{item.id}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.email}</p>
            </div>
            <div className="ml-auto font-medium">{item.amount}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
