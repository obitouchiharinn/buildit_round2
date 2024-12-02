import spin from '../../imdb-next/public/spinner.svg'

export default function loading() {
  return (
    <div className='flex justify-center mt-16'>
      <img className='h-52' src={spin} alt='loading...' />
    </div>
  );
}
