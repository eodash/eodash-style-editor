import style from './style.json'

export default {
  id: 'crop-circles',
  name: 'Cairo Crop Circles',
  format: 'geotiff',
  dataUrl:
    'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
  style,
  layers: [
    {
      type: 'WebGLTile',
      properties: {
        id: 'GeoTIFFLayer',
        title: 'Cairo Crop Circles',
      },
      source: {
        type: 'GeoTIFF',
        sources: [
          {
            url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
          }
        ]
      },
      style,
    },
  ],
}
