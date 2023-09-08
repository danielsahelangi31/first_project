import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GroupAlat from 'App/Models/GroupAlat'


export default class extends BaseSeeder {
  public async run () {
    await GroupAlat.createMany([ 
      {
        kode_alat: 'ARG', 
        deskripsi_alat: 'AUTOMATIC RUBBER TIRED GANTRY CRANE'
      },
      {
        kode_alat: 'ASC', 
        deskripsi_alat: 'AUTOMATIC STACKING CRANE'
      },
      {
        kode_alat: 'BCT', 
        deskripsi_alat: 'BUCKET'
      },
      {
        kode_alat: 'BLD', 
        deskripsi_alat: 'BULLDOZER'
      },
      {
        kode_alat: 'CHS', 
        deskripsi_alat: 'CHASSIS'
      },
      {
        kode_alat: 'CSS', 
        deskripsi_alat: 'CASSETTE SYSTEM'
      },
      {
        kode_alat: 'CTT', 
        deskripsi_alat: 'COMBINED TERMINAL TRACTOR'
      },
      {
        kode_alat: 'CVR', 
        deskripsi_alat: 'CONVEYOR'
      },
      {
        kode_alat: 'DOL', 
        deskripsi_alat: 'DOLLY SYSTEM'
      },
      {
        kode_alat: 'DTR', 
        deskripsi_alat: 'DUMP TRUCK'
      },
      {
        kode_alat: 'EXC', 
        deskripsi_alat: 'EXCAVATOR'
      },
      {
        kode_alat: 'FJC', 
        deskripsi_alat: 'FIX JIB CRANE'
      },
      {
        kode_alat: 'FLC', 
        deskripsi_alat: 'FLOATING CRANE'
      },
      {
        kode_alat: 'FLT', 
        deskripsi_alat: 'FORKLIFT'
      },
      {
        kode_alat: 'GJC', 
        deskripsi_alat: 'GANTRY JIB CRANE'
      },
      {
        kode_alat: 'GLC', 
        deskripsi_alat: 'GANTRY LUFFING CRANE'
      },
      {
        kode_alat: 'GRB', 
        deskripsi_alat: 'GRAB'
      },
      {
        kode_alat: 'GSU', 
        deskripsi_alat: 'GRAB SHIP UNLOADER'
      },
      {
        kode_alat: 'HDT', 
        deskripsi_alat: 'HEAD TRUCK'
      },
      {
        kode_alat: 'HMC', 
        deskripsi_alat: 'HARBOUR MOBILE CRANE'
      },
      {
        kode_alat: 'HOP', 
        deskripsi_alat: 'HOPPER'
      },
      {
        kode_alat: 'HPC', 
        deskripsi_alat: 'HARBOUR PORTAL CRANE'
      },
      {
        kode_alat: 'MBC', 
        deskripsi_alat: 'MOBILE CRANE'
      },
      {
        kode_alat: 'MEL', 
        deskripsi_alat: 'MOBILE ELEVATOR'
      },
      {
        kode_alat: 'OHC', 
        deskripsi_alat: 'OVERHEAD CRANE'
      },
      {
        kode_alat: 'PLM', 
        deskripsi_alat: 'PALLET MOVER'
      },
      {
        kode_alat: 'QCC', 
        deskripsi_alat: 'QUAY CONTAINER CRANE'
      },
      {
        kode_alat: 'RAM', 
        deskripsi_alat: 'RAMP DOOR'
      },
      {
        kode_alat: 'RMG', 
        deskripsi_alat: 'RAIL MOUNTED GANTRY CRANE'
      },
      {
        kode_alat: 'RTR', 
        deskripsi_alat: 'REACH TRUCK'
      },
      {
        kode_alat: 'RST', 
        deskripsi_alat: 'REACH STACKER'
      },
      {
        kode_alat: 'RTG', 
        deskripsi_alat: 'RUBBER TYRED GANTRY CRANE'
      },
      {
        kode_alat: 'SIL', 
        deskripsi_alat: 'SIDE LOADER'
      },
      {
        kode_alat: 'TRN', 
        deskripsi_alat: 'TRONTON'
      },
      {
        kode_alat: 'TSL', 
        deskripsi_alat: 'TRANSLIFTER'
      },
      {
        kode_alat: 'TTR', 
        deskripsi_alat: 'TERMINAL TRACTOR'
      },
      {
        kode_alat: 'WGB', 
        deskripsi_alat: 'WEIGHT BRIDGE'
      },
      {
        kode_alat: 'WHL', 
        deskripsi_alat: 'WHEEL LOADER'
      }
    ]); 
  }
}
