import { typeChart } from '@/utils/index';
type ChipType = {
    name: string[];
}

export default function TypeChip(props: ChipType) {
    const { name } = props
    const chart = typeChart()
    return (
        <div className='flex gap-x-2 justify-center items-center'>
            {
                name.map((item, index) => {
                    const type = chart.find(c => c.type.toLowerCase() === item.toLowerCase());
                    return (
                        <div key={`${item}-${index}`} className={`p-2 uppercase font-bold text-[14px] rounded-[8px] ${type?.text || 'text-black'} ${type?.bgColor || 'bg-white'}`}>
                            { item }
                        </div>
                    )
                })
            }
        </div>
    )
}