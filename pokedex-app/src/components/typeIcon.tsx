import { typeChart } from '@/utils/index';

export function TypeIcon({type}: {type: string}) {
    const chart = typeChart();
    const foundType = chart.find(c => c.type === type);
    return(
        foundType && 
        <img src={`${foundType.icon}`} width={30} height={30} className={`rounded-full ${foundType.bgColor} p-1`} />
    )
}