import React, { Fragment } from 'react';
import styles from "./index.less"
import cx from "classnames"
import app from '@/assets/images/main-icon3.png';
import user from '@/assets/images/main-icon4.png';
import dataBoard from '@/assets/images/main-icon8.png';
import navDisabledIcon from '@/assets/images/nav-disabled.png';
import { history } from 'umi';
const colorLinearGradient = [
  '-45deg, #164EAB, #2075D9, #389EFE',
  '-45deg, #AA2A0E, #E05611',
  '-45deg, #164EAB, #2075D9, #389EFE',
  '-45deg, #227019, #6FBA33',
  '-45deg, #164EAB, #2075D9, #389EFE',
  '-45deg, #FF8004, #F4C626',
  '-45deg, #227019, #6FBA33',
];
const borderColor = ['#2783E6', '#D24B10', '#2783E6', '#4E9A28', '#2783E6', '#F9A415', ''];

export type navItem = {
  key: string,
  name: string,
  path: string,
  color: string,
  borderColor: string,
  icon: any,
}

const navList: navItem[] = [
  {
    name: "会员管理",
    path: "/memberManage",
    key: "memberManage",
    color: colorLinearGradient[5],
    borderColor: borderColor[5],
    icon: user
  },
  {
    name: "用户管理",
    path: "/userManage",
    key: "userManage",
    color: colorLinearGradient[0],
    borderColor: borderColor[0],
    icon: user
  },
  {
    name: "应用管理",
    path: "/app",
    key: "app",
    color: colorLinearGradient[1],
    borderColor: borderColor[1],
    icon: app
  },
  {
    name: "数据看板",
    path: "/dataBoard",
    key: "dataBoard",
    color: colorLinearGradient[3],
    borderColor: borderColor[3],
    icon: dataBoard
  },
]

const Navigation: React.FC = () => {
  let i = 0;
  const mainList = () => {
    return navList.map(ee => ({
      ...ee,
      disabled: false,
    }))
  }
  const handleLink = (path: string) => {
    history.push(path)
  }
  return (
    <div className={styles['mainNav']}>
      <div className={styles['mainNav-link']}>
        <div className={styles['mainNav-link-box']}>
          {
            mainList().map(ee => {
              i = i + 1;
              const itemClasses = cx(
                styles['mainNav-link-item-content'],
                {
                  [styles['mainNav-link-item-disabled']]: !!ee.disabled,
                }
              );
              const content = (
                <Fragment>
                  <img className={styles['mainNav-link-item-content_icon']} src={ee.icon} alt='' />
                  <span>{ee.name}</span>
                </Fragment>
              )
              return (
                <div
                  key={ee.key}
                  style={{ animationDelay: `${0.1 * i}s` }}
                  className={styles['mainNav-link-item']}
                >
                  {
                    ee.disabled ? (
                      <div
                        className={itemClasses}
                        style={{
                          background: `linear-gradient(${ee.color})`,
                        }}
                      >
                        {content}
                        <img className={styles['mainNav-link-item-disabled_icon']} src={navDisabledIcon} alt="" />
                      </div>
                    ) : (
                      <div
                        style={{
                          background: `linear-gradient(${ee.color})`,
                          border: ee.borderColor ? `1px solid ${ee.borderColor}` : 'none'
                        }}
                        className={itemClasses}
                        onClick={() => handleLink(ee.path)}
                      >
                        {content}
                      </div>
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
export default Navigation
