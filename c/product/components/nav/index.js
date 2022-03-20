import styles from './styles.module.css'

export default function Nav(){
  return(
    <div className={styles.nav}>
      <div>
        <b>debate.sh</b>
      </div>
      <img src="https://www.gravatar.com/avatar/861c4da7b53063ea96c055565495510f" />
    </div>
  )
}