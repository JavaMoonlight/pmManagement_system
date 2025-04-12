package com.szcu.mms_announcement.Controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.szcu.mms_announcement.Service.AnnouncementService;
import com.szcu.mms_base.Model.Announcement;
import com.szcu.mms_base.Model.R;
import com.szcu.mms_base.Model.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

	@Autowired
	AnnouncementService announcementService;

	@PostMapping("/add")
	public R<String> addAnnouncement(@RequestBody Announcement a){
		return announcementService.addAnnouncement(a);
	}

	@PostMapping("/delete/{id}")
	public R<String> deleteAnnouncement(@PathVariable int id){
		return announcementService.deleteAnnouncement(id);
	}

	@PostMapping("/update")
	public R<String> updateAnnouncement(@RequestBody Announcement a){
		return announcementService.addAnnouncement(a);
	}

	@GetMapping("/get/{pageNum}/{size}")
	public R<List<Announcement>> getAnnouncement(@PathVariable int pageNum, @PathVariable int size){
		if(UserContext.getUser() != null) {
			IPage<Announcement> page = new Page<>(pageNum, size);
			return R.success(announcementService.page(page).getRecords());
		}
		return R.error("请先登录");
	}
}
