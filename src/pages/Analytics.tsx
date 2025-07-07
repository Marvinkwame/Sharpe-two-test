import ExchangeRatePieChart from "../components/ExchangeRate/ExchangeRate"
import { useExchangeRates } from "../hooks/useExchangeRate"

const Analytics = () => {
  const { data, isLoading, error } = useExchangeRates()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (error || !data) {
    return <div>Error loading data</div>
  }

  return (
    <div>
      <ExchangeRatePieChart data={data} />
    </div> 
  )
}

export default Analytics