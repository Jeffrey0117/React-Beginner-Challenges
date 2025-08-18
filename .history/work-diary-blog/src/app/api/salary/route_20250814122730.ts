import { NextResponse } from 'next/server'

// 薪資資料結構
interface SalaryData {
  month: string
  year: number
  salary: number
  laborInsurance: number  // 勞保自付額
  healthInsurance: number // 健保自付額
  netSalary: number       // 實領薪資
  isFullMonth: boolean    // 是否足月
  hourlyWage: number      // 時薪
}

// 模擬薪資資料 - 實際環境中可能來自資料庫或其他 API
const salaryRecords: SalaryData[] = [
  {
    month: '6月',
    year: 2025,
    salary: 29019,
    laborInsurance: 841,   // 6月不足月勞保自付額
    healthInsurance: 540,  // 6月健保自付額
    netSalary: 29019,
    isFullMonth: false,    // 6月不足月
    hourlyWage: 200,
    actualWorkingHours: 152  // 6月實際工時 152 小時
  },
  {
    month: '7月',
    year: 2025,
    salary: 33790,
    laborInsurance: 870,   // 7月之後足月勞保自付額
    healthInsurance: 540,  // 7月健保自付額
    netSalary: 33790,
    isFullMonth: true,     // 7月之後足月
    hourlyWage: 200,
    actualWorkingHours: 176  // 7月實際工時 176 小時
  }
]

export async function GET() {
  try {
    console.log('💰 正在獲取薪資統計資料')

    // 計算統計資料
    const totalSalary = salaryRecords.reduce((sum, record) => sum + record.salary, 0)
    const totalLaborInsurance = salaryRecords.reduce((sum, record) => sum + record.laborInsurance, 0)
    const totalHealthInsurance = salaryRecords.reduce((sum, record) => sum + record.healthInsurance, 0)
    const totalInsurance = totalLaborInsurance + totalHealthInsurance
    
    const averageSalary = salaryRecords.length > 0 ? Math.round(totalSalary / salaryRecords.length) : 0
    const currentHourlyWage = salaryRecords[salaryRecords.length - 1]?.hourlyWage || 200
    
    // 計算工時統計 (假設每月工作22天，每天8小時)
    const estimatedWorkingHours = salaryRecords.map(record => {
      if (record.isFullMonth) {
        return Math.round(record.salary / record.hourlyWage)
      } else {
        // 6月不足月，按實際薪資計算工時
        return Math.round(record.salary / record.hourlyWage)
      }
    })
    
    const totalWorkingHours = estimatedWorkingHours.reduce((sum, hours) => sum + hours, 0)
    const averageWorkingHours = estimatedWorkingHours.length > 0 ? Math.round(totalWorkingHours / estimatedWorkingHours.length) : 0

    const stats = {
      records: salaryRecords,
      summary: {
        totalSalary,
        totalLaborInsurance,
        totalHealthInsurance,
        totalInsurance,
        averageSalary,
        currentHourlyWage,
        totalWorkingHours,
        averageWorkingHours,
        monthsWorked: salaryRecords.length,
        latestMonth: salaryRecords[salaryRecords.length - 1]?.month || '',
        latestYear: salaryRecords[salaryRecords.length - 1]?.year || 2025
      }
    }

    console.log('💰 薪資統計結果:', stats.summary)
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('❌ 薪資統計錯誤:', error)
    return NextResponse.json(
      { error: '薪資統計失敗', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    )
  }
}
