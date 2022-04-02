import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from '../components/nav'
import Header from '../components/home/header'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { User as UserType } from '@prisma/client'

export default function Home(props: {user: UserType | undefined}) {
  return (
    <div>
      <Nav user={props.user || undefined} />
      <Header />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require('./api/user');
  let user = await fetchUser(context.req.cookies["auth"])
  return { props: {user}}
}