package com.szcu.mms_announcement.Service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.szcu.mms_announcement.Mapper.AnnouncementMapper;
import com.szcu.mms_announcement.Service.AnnouncementService;
import com.szcu.mms_announcement.Mapper.UserAuthMapper_Announcement;
import com.szcu.mms_base.Model.Announcement;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserContext;
import com.szcu.mms_base.Model.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AnnouncementServiceImpl extends ServiceImpl<AnnouncementMapper, Announcement> implements AnnouncementService {

	@Autowired
	AnnouncementMapper announcementMapper;

	@Autowired
	UserAuthMapper_Announcement userAuthMapperAnnouncement;

	@Override
	public R<String> addAnnouncement(Announcement a) {
		if(!checkEligibility(UserContext.getUser())){
			return R.error("权限不足");
		}
		LambdaQueryWrapper<Announcement> lqw = new LambdaQueryWrapper<>();
		lqw.eq(Announcement::getId, a.getId());
		Announcement announcement = announcementMapper.selectOne(lqw);
		if(announcement != null){
			a.setUpdate_time(LocalDateTime.now());
			announcementMapper.updateById(a);
			return R.success("通知更新成功");
		}
		a.setCreate_time(LocalDateTime.now());
		a.setUpdate_time(LocalDateTime.now());
		a.setPublish_time(LocalDate.now());
		announcementMapper.insert(a);
		return R.success("通知发布成功");
	}

	@Override
	public R<String> deleteAnnouncement(int id) {
		if(!checkEligibility(UserContext.getUser())){
			return R.error("权限不足");
		}
		announcementMapper.deleteById(id);
		return R.success("通知删除成功");
	}

	private boolean checkEligibility(String username){
		LambdaQueryWrapper<UserInfo> lqw = new LambdaQueryWrapper<>();
		lqw.eq(UserInfo::getUsername, username);
		UserInfo userInfo = userAuthMapperAnnouncement.selectOne(lqw);
		String role = userInfo.getRole();
		return "ADMIN".equals(role) || "TEACHER".equals(role);
	}
}
